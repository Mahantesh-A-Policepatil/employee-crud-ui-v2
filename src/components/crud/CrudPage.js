import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-bs5";
import { Modal } from "bootstrap";
import apiClient, { API_BASE_URL, getSafeApiErrorMessage } from "../../api/apiClient";
import { useAuth } from "../../contexts/AuthContext";
import { getStoredAuth } from "../../services/auth";
import AppLayout from "../layout/AppLayout";
import ForbiddenPage from "../common/ForbiddenPage";
import CrudFeedbackModal from "./CrudFeedbackModal";
import CrudFormModal from "./CrudFormModal";
import { createEmptyForm, formatValidationErrors, validateForm } from "./crudUtils";

function CrudPage({ config }) {
    const { hasPermission } = useAuth();
    const configRef = useRef(config);
    const tableRef = useRef();
    const dataTable = useRef(null);
    const createModalRef = useRef(null);
    const editModalRef = useRef(null);
    const feedbackModalRef = useRef(null);
    const openEditModalRef = useRef(null);
    const handleDeleteRef = useRef(null);

    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState(() => createEmptyForm(config.fields));
    const [selectOptions, setSelectOptions] = useState({});
    const [isForbidden, setIsForbidden] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: "",
        title: "",
        message: "",
        color: "primary",
        action: null,
    });

    const canView = hasPermission(config.permissions?.view);
    const canCreate = hasPermission(config.permissions?.create);

    const cleanupModal = () => {
        document.body.classList.remove("modal-open");
        document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    };

    const showFeedback = (nextModalConfig) => {
        setModalConfig(nextModalConfig);
        Modal.getOrCreateInstance(feedbackModalRef.current).show();
    };

    const reloadTable = () => {
        setTimeout(() => {
            dataTable.current?.ajax.reload(null, false);
        }, 300);
    };

    const handleClearSearch = () => {
        setSearchText("");
        dataTable.current.search("").draw();
    };

    const handleSearch = () => {
        dataTable.current.search(searchText).draw();
    };

    const handleChange = (e) => {
        if (e.target.type === "checkbox") {
            const currentValues = form[e.target.name] || [];
            const nextValues = e.target.checked
                ? [...currentValues, e.target.value]
                : currentValues.filter((value) => String(value) !== String(e.target.value));

            setForm({ ...form, [e.target.name]: nextValues });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
        setErrors({ ...errors, [e.target.name]: "" });
    };

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
                type: "error",
                title: "Error",
                message: getSafeApiErrorMessage(error, `Failed to load ${config.entityName.toLowerCase()}.`),
                color: "danger",
                action: null,
            });
        } finally {
            setLoading(false);
        }
    };
    openEditModalRef.current = openEditModal;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm(config.fields, form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        const isEdit = Boolean(form.id);
        const modalRef = isEdit ? editModalRef : createModalRef;
        const modalInstance = Modal.getOrCreateInstance(modalRef.current);

        setLoading(true);

        try {
            if (isEdit) {
                await apiClient.put(`${config.apiEndpoint}/${form.id}`, form);
            } else {
                await apiClient.post(config.apiEndpoint, form);
            }

            modalInstance.hide();
            cleanupModal();
            reloadTable();
            showFeedback({
                type: "success",
                title: "Success",
                message: isEdit
                    ? `${config.entityName} updated successfully`
                    : `${config.entityName} created successfully`,
                color: "success",
                action: null,
            });
        } catch (error) {
            if (error.response?.status === 422 && error.response?.data?.errors) {
                const formattedErrors = formatValidationErrors(error.response.data.errors);
                setErrors(formattedErrors);
                showFeedback({
                    type: "error",
                    title: "Validation Error",
                    message: Object.values(formattedErrors).join("\n"),
                    color: "danger",
                    action: null,
                });
                return;
            }

            showFeedback({
                type: "error",
                title: "Error",
                message: getSafeApiErrorMessage(error, "An error occurred while processing your request."),
                color: "danger",
                action: null,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const modalInstance = Modal.getOrCreateInstance(feedbackModalRef.current);

        setLoading(true);

        try {
            await apiClient.delete(`${config.apiEndpoint}/${id}`);
            modalInstance.hide();
            cleanupModal();
            reloadTable();
            showFeedback({
                type: "success",
                title: "Success",
                message: `${config.entityName} deleted successfully`,
                color: "success",
                action: null,
            });
        } catch (error) {
            showFeedback({
                type: "error",
                title: "Delete Error",
                message: getSafeApiErrorMessage(error, `Failed to delete ${config.entityName.toLowerCase()}.`),
                color: "danger",
                action: null,
            });
        } finally {
            setLoading(false);
        }
    };
    handleDeleteRef.current = handleDelete;

    useEffect(() => {
        if (!canView || isForbidden) {
            return;
        }

        const optionFields = config.fields.filter(
            (field) => ["select", "checkbox-group"].includes(field.type) && field.optionsEndpoint
        );

        optionFields.forEach((field) => {
            apiClient
                .get(field.optionsEndpoint)
                .then((response) => {
                    setSelectOptions((currentOptions) => ({
                        ...currentOptions,
                        [field.name]: response.data,
                    }));
                })
                .catch((error) => {
                    showFeedback({
                        type: "error",
                        title: "Error",
                        message: getSafeApiErrorMessage(error, `Failed to load ${field.label.toLowerCase()} options.`),
                        color: "danger",
                        action: null,
                    });
                });
        });
    }, [config.fields, canView, isForbidden]);

    useEffect(() => {
        if (!canView || isForbidden) {
            return undefined;
        }

        const tableElement = tableRef.current;
        const currentConfig = configRef.current;

        dataTable.current = $(tableElement).DataTable({
            processing: true,
            serverSide: true,
            responsive: false,
            autoWidth: false,
            layout: {
                topStart: null,
                topEnd: null,
                bottomStart: "info",
                bottomEnd: {
                    className: "dt-layout-end col-md-auto ms-auto d-flex justify-content-end align-items-center gap-3",
                    features: ["pageLength", "paging"],
                },
            },
            ajax: function (requestData, callback) {
                $.ajax({
                    url: `${API_BASE_URL}${currentConfig.apiEndpoint}`,
                    type: "GET",
                    data: requestData,
                    beforeSend: function (xhr) {
                        const auth = getStoredAuth();
                        if (auth?.token) {
                            xhr.setRequestHeader("Authorization", `Bearer ${auth.token}`);
                        }
                    },
                    success: function (response) {
                        callback(response);
                    },
                    error: function (xhr) {
                        if (xhr.status === 403) {
                            setIsForbidden(true);
                        }

                        callback({
                            draw: requestData.draw,
                            recordsTotal: 0,
                            recordsFiltered: 0,
                            data: [],
                        });
                    },
                });
            },
            columns: [
                ...currentConfig.tableColumns,
                {
                    data: currentConfig.idField || "id",
                    orderable: false,
                    searchable: false,
                    render: function (data) {
                        const canUpdate = hasPermission(currentConfig.permissions?.update);
                        const canDelete = hasPermission(currentConfig.permissions?.delete);
                        const editButton = canUpdate
                            ? `
                                <button class="btn btn-sm btn-primary btn-with-icon crud-edit" data-id="${data}">
                                    <span class="button-icon" aria-hidden="true">&#9998;</span>
                                    <span>Edit</span>
                                </button>
                            `
                            : "";
                        const deleteButton = canDelete
                            ? `
                                <button class="btn btn-sm btn-danger btn-with-icon crud-delete" data-id="${data}">
                                    <span class="button-icon" aria-hidden="true">&#128465;</span>
                                    <span>Delete</span>
                                </button>
                            `
                            : "";

                        return editButton || deleteButton
                            ? `${editButton}${deleteButton}`
                            : '<span class="text-muted">View only</span>';
                    },
                },
            ],
        });

        $(tableElement).on("click", ".crud-edit", function () {
            openEditModalRef.current($(this).data("id"));
        });

        $(tableElement).on("click", ".crud-delete", function () {
            const id = $(this).data("id");

            showFeedback({
                type: "delete",
                title: "Confirm Delete",
                message: `Are you sure you want to delete this ${currentConfig.entityName.toLowerCase()}?`,
                color: "danger",
                action: () => handleDeleteRef.current(id),
            });
        });

        return () => {
            $(tableElement).off("click", ".crud-edit");
            $(tableElement).off("click", ".crud-delete");
            dataTable.current?.destroy();
            dataTable.current = null;
        };
    }, [canView, hasPermission, isForbidden]);

    const shouldShowForbidden = !canView || isForbidden;

    return (
        <AppLayout loading={loading}>
            {shouldShowForbidden ? (
                <ForbiddenPage />
            ) : (
                <>
                    <div className="page-title-row">
                        <div>
                            <h1>{config.title}</h1>
                        </div>
                    </div>

                    <div className="table-panel">
                        <div className="datatable-toolbar">
                            <div className="position-relative">
                                <input
                                    type="text"
                                    className="form-control form-control-sm pe-4 search-input"
                                    placeholder="Search..."
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />

                                {searchText && (
                                    <span className="search-clear" onClick={handleClearSearch}>
                                        &times;
                                    </span>
                                )}
                            </div>

                            <button className="btn btn-primary btn-sm btn-with-icon" onClick={handleSearch}>
                                <span className="button-icon" aria-hidden="true">&#128269;</span>
                                <span>Search</span>
                            </button>

                            {canCreate && (
                                <button className="btn btn-success btn-sm px-3 btn-with-icon" onClick={openCreateModal}>
                                    <span className="button-icon" aria-hidden="true">+</span>
                                    <span>Create {config.entityName}</span>
                                </button>
                            )}
                        </div>

                        <table className="table table-bordered crud-table" ref={tableRef}>
                            <thead>
                                <tr>
                                    {config.tableColumns.map((column) => (
                                        <th key={column.data}>{column.title}</th>
                                    ))}
                                    <th>Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <CrudFormModal
                        modalRef={createModalRef}
                        title={`Create ${config.entityName}`}
                        headerColor="success"
                        submitLabel="Create"
                        loadingLabel="Creating..."
                        fields={config.fields}
                        form={form}
                        errors={errors}
                        selectOptions={selectOptions}
                        loading={loading}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />

                    <CrudFormModal
                        modalRef={editModalRef}
                        title={`Edit ${config.entityName}`}
                        headerColor="primary"
                        submitLabel="Update"
                        loadingLabel="Updating..."
                        fields={config.fields}
                        form={form}
                        errors={errors}
                        selectOptions={selectOptions}
                        loading={loading}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                    />

                    <CrudFeedbackModal
                        modalRef={feedbackModalRef}
                        modalConfig={modalConfig}
                        loading={loading}
                        cleanupModal={cleanupModal}
                    />
                </>
            )}
        </AppLayout>
    );
}

export default CrudPage;
