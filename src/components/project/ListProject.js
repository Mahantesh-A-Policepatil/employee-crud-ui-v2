import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import { Modal } from "bootstrap";
import apiClient, { API_BASE_URL, getSafeApiErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { getStoredAuth } from "../../services/auth";
import projectCrudConfig from "../../crud/projectCrudConfig";
import AppLayout from "../layout/AppLayout";
import ForbiddenPage from "../common/ForbiddenPage";
import CrudFeedbackModal from "../crud/CrudFeedbackModal";
import CrudFormModal from "../crud/CrudFormModal";
import { createEmptyForm, formatValidationErrors, validateForm } from "../crud/crudUtils";

const config = projectCrudConfig;

function escapeHtml(value) {
    return $("<div>").text(value ?? "").html();
}

function employeePanel(employees = []) {
    if (!employees.length) {
        return '<div class="project-empty-employees">No employees are assigned to this project.</div>';
    }

    const rows = employees.map((employee) => `
        <tr>
            <td>${escapeHtml(employee.name)}</td>
            <td>${escapeHtml(employee.email)}</td>
            <td>${escapeHtml(employee.designation)}</td>
            <td>${escapeHtml(employee.department?.name || employee.department_name || "—")}</td>
        </tr>
    `).join("");

    return `
        <div class="project-employees-panel">
            <div class="project-employees-title">Assigned Employees</div>
            <div class="table-responsive">
                <table class="table table-sm project-employees-table">
                    <thead><tr><th>Name</th><th>Email</th><th>Designation</th><th>Department</th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>
    `;
}

function ListProject() {
    const { hasPermission } = useAuth();
    const tableRef = useRef(null);
    const dataTable = useRef(null);
    const createModalRef = useRef(null);
    const editModalRef = useRef(null);
    const feedbackModalRef = useRef(null);
    const openEditModalRef = useRef(null);
    const deleteRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(() => createEmptyForm(config.fields));
    const [selectOptions, setSelectOptions] = useState({});
    const [isForbidden, setIsForbidden] = useState(false);
    const [modalConfig, setModalConfig] = useState({});
    const canView = hasPermission(config.permissions.view);
    const canCreate = hasPermission(config.permissions.create);

    const cleanupModal = () => {
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach((element) => element.remove());
    };

    const showFeedback = (nextConfig) => {
        setModalConfig(nextConfig);
        Modal.getOrCreateInstance(feedbackModalRef.current).show();
    };

    const reloadTable = () => setTimeout(() => dataTable.current?.ajax.reload(null, false), 300);

    const openCreateModal = () => {
        setForm(createEmptyForm(config.fields));
        setErrors({});
        Modal.getOrCreateInstance(createModalRef.current).show();
    };

    const openEditModal = async (id) => {
        setLoading(true);
        try {
            const response = await apiClient.get(`${config.apiEndpoint}/${id}`);
            setForm(response.data);
            setErrors({});
            Modal.getOrCreateInstance(editModalRef.current).show();
        } catch (error) {
            showFeedback({
                type: "error", title: "Error", color: "danger", action: null,
                message: getSafeApiErrorMessage(error, "Failed to load project."),
            });
        } finally {
            setLoading(false);
        }
    };
    openEditModalRef.current = openEditModal;

    const handleChange = (event) => {
        if (event.target.type === "checkbox") {
            setForm((current) => {
                const currentValues = current[event.target.name] || [];
                const nextValues = event.target.checked
                    ? [...currentValues, event.target.value]
                    : currentValues.filter((value) => String(value) !== String(event.target.value));

                return { ...current, [event.target.name]: nextValues };
            });
        } else {
            setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
        }
        setErrors((current) => ({ ...current, [event.target.name]: "" }));
    };

    useEffect(() => {
        if (!canView || isForbidden || (!canCreate && !hasPermission(config.permissions.update))) return;

        const employeeField = config.fields.find((field) => field.name === "employee_ids");
        apiClient.get(employeeField.optionsEndpoint)
            .then((response) => {
                setSelectOptions((current) => ({ ...current, employee_ids: response.data }));
            })
            .catch((error) => {
                showFeedback({
                    type: "error", title: "Error", color: "danger", action: null,
                    message: getSafeApiErrorMessage(error, "Failed to load employee options."),
                });
            });
    }, [canCreate, canView, hasPermission, isForbidden]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm(config.fields, form);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length) return;

        const isEdit = Boolean(form.id);
        const modalRef = isEdit ? editModalRef : createModalRef;
        setLoading(true);
        try {
            if (isEdit) {
                await apiClient.put(`${config.apiEndpoint}/${form.id}`, form);
            } else {
                await apiClient.post(config.apiEndpoint, form);
            }
            Modal.getOrCreateInstance(modalRef.current).hide();
            cleanupModal();
            reloadTable();
            showFeedback({
                type: "success", title: "Success", color: "success", action: null,
                message: `Project ${isEdit ? "updated" : "created"} successfully`,
            });
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                setErrors(formatValidationErrors(error.response.data.errors));
            }
            showFeedback({
                type: "error", title: "Error", color: "danger", action: null,
                message: getSafeApiErrorMessage(error, "Failed to save project."),
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await apiClient.delete(`${config.apiEndpoint}/${id}`);
            Modal.getOrCreateInstance(feedbackModalRef.current).hide();
            cleanupModal();
            reloadTable();
            showFeedback({
                type: "success", title: "Success", color: "success", action: null,
                message: "Project deleted successfully",
            });
        } catch (error) {
            showFeedback({
                type: "error", title: "Delete Error", color: "danger", action: null,
                message: getSafeApiErrorMessage(error, "Failed to delete project."),
            });
        } finally {
            setLoading(false);
        }
    };
    deleteRef.current = handleDelete;

    useEffect(() => {
        if (!canView || isForbidden) return undefined;
        const tableElement = tableRef.current;

        dataTable.current = $(tableElement).DataTable({
            processing: true,
            serverSide: true,
            responsive: false,
            autoWidth: false,
            layout: {
                topStart: null, topEnd: null, bottomStart: "info",
                bottomEnd: { className: "dt-layout-end col-md-auto ms-auto d-flex justify-content-end align-items-center gap-3", features: ["pageLength", "paging"] },
            },
            ajax(requestData, callback) {
                $.ajax({
                    url: `${API_BASE_URL}${config.apiEndpoint}`,
                    type: "GET",
                    data: requestData,
                    beforeSend(xhr) {
                        const auth = getStoredAuth();
                        if (auth?.token) xhr.setRequestHeader("Authorization", `Bearer ${auth.token}`);
                    },
                    success: callback,
                    error(xhr) {
                        if (xhr.status === 403) setIsForbidden(true);
                        callback({ draw: requestData.draw, recordsTotal: 0, recordsFiltered: 0, data: [] });
                    },
                });
            },
            columns: [
                {
                    data: null, orderable: false, searchable: false,
                    className: "project-expand-cell",
                    render: () => '<button class="project-expand-button" type="button" aria-label="Expand project" aria-expanded="false">+</button>',
                },
                ...config.tableColumns,
                {
                    data: "id", orderable: false, searchable: false,
                    render(id) {
                        const edit = hasPermission(config.permissions.update)
                            ? `<button class="btn btn-sm btn-primary btn-with-icon project-edit" data-id="${id}"><span class="button-icon">&#9998;</span><span>Edit</span></button>` : "";
                        const remove = hasPermission(config.permissions.delete)
                            ? `<button class="btn btn-sm btn-danger btn-with-icon project-delete" data-id="${id}"><span class="button-icon">&#128465;</span><span>Delete</span></button>` : "";
                        return edit || remove ? `<div class="action-buttons-group">${edit}${remove}</div>` : '<span class="text-muted">View only</span>';
                    },
                },
            ],
        });

        $(tableElement).on("click", ".project-expand-button", function () {
            const button = $(this);
            const row = dataTable.current.row(button.closest("tr"));
            if (row.child.isShown()) {
                row.child.hide();
                button.text("+").attr("aria-expanded", "false");
            } else {
                row.child(employeePanel(row.data().employees)).show();
                button.text("−").attr("aria-expanded", "true");
            }
        });
        $(tableElement).on("click", ".project-edit", function () {
            openEditModalRef.current($(this).data("id"));
        });
        $(tableElement).on("click", ".project-delete", function () {
            const id = $(this).data("id");
            showFeedback({
                type: "delete", title: "Confirm Delete", color: "danger",
                message: "Are you sure you want to delete this project?",
                action: () => deleteRef.current(id),
            });
        });

        return () => {
            $(tableElement).off("click");
            dataTable.current?.destroy();
            dataTable.current = null;
        };
    }, [canView, hasPermission, isForbidden]);

    const handleSearch = () => dataTable.current?.search(searchText).draw();
    const clearSearch = () => {
        setSearchText("");
        dataTable.current?.search("").draw();
    };

    return (
        <AppLayout loading={loading}>
            {!canView || isForbidden ? <ForbiddenPage /> : <>
                <div className="page-title-row"><h1>{config.title}</h1></div>
                <div className="table-panel">
                    <div className="datatable-toolbar">
                        <div className="position-relative">
                            <input className="form-control form-control-sm pe-4 search-input" placeholder="Search..."
                                value={searchText} onChange={(event) => setSearchText(event.target.value)}
                                onKeyDown={(event) => event.key === "Enter" && handleSearch()} />
                            {searchText && <span className="search-clear" onClick={clearSearch}>&times;</span>}
                        </div>
                        <button className="btn btn-primary btn-sm btn-with-icon" onClick={handleSearch}>
                            <span className="button-icon">&#128269;</span><span>Search</span>
                        </button>
                        {canCreate && <button className="btn btn-success btn-sm px-3 btn-with-icon" onClick={openCreateModal}>
                            <span className="button-icon">+</span><span>Create Project</span>
                        </button>}
                    </div>
                    <table className="table table-bordered crud-table project-table" ref={tableRef}>
                        <thead><tr><th aria-label="Expand"></th>{config.tableColumns.map((column) => <th key={column.data}>{column.title}</th>)}<th>Action</th></tr></thead>
                    </table>
                </div>
                <CrudFormModal modalRef={createModalRef} title="Create Project" headerColor="success"
                    submitLabel="Create" loadingLabel="Creating..." fields={config.fields} form={form}
                    errors={errors} selectOptions={selectOptions} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />
                <CrudFormModal modalRef={editModalRef} title="Edit Project" headerColor="primary"
                    submitLabel="Update" loadingLabel="Updating..." fields={config.fields} form={form}
                    errors={errors} selectOptions={selectOptions} loading={loading} onChange={handleChange} onSubmit={handleSubmit} />
                <CrudFeedbackModal modalRef={feedbackModalRef} modalConfig={modalConfig} loading={loading} cleanupModal={cleanupModal} />
            </>}
        </AppLayout>
    );
}

export default ListProject;
