import React from "react";

function getNestedValue(record, path) {
  return path?.split(".").reduce((value, key) => value?.[key], record);
}

function parseEmployeeLabel(label = "") {
  const match = label.match(/^(.*?)\s*\((.*?)\)\s*$/);

  return {
    name: match ? match[1] : label,
    email: match ? match[2] : "",
  };
}

function getSelectedRecords(field, form, selectOptions) {
  const selectedIds = (form[field.name] || []).map(String);
  const existingEmployees = Array.isArray(form.employees) ? form.employees : [];
  const options = selectOptions[field.name] || field.options || [];

  return selectedIds.map((selectedId) => {
    const existingEmployee = existingEmployees.find(
      (employee) => String(employee.id) === selectedId,
    );
    const option = options.find((item) => String(item.value) === selectedId);
    const parsedLabel = parseEmployeeLabel(option?.label);

    if (existingEmployee) {
      return {
        ...existingEmployee,
        description: option?.description ?? existingEmployee.description,
      };
    }

    return {
      id: selectedId,
      name: parsedLabel.name || selectedId,
      email: parsedLabel.email,
      description: option?.description,
    };
  });
}

function SelectedRecordsTable({ field, form, selectOptions }) {
  if (!form.id || !field.selectedTable) {
    return null;
  }

  const records = getSelectedRecords(field, form, selectOptions);

  return (
    <div className="crud-selected-table">
      <div className="crud-selected-table-title">
        {field.selectedTable.title}
      </div>
      {records.length ? (
        <div className="table-responsive">
          <table className="table table-sm crud-selected-records-table">
            <thead>
              <tr>
                {field.selectedTable.columns.map((column) => (
                  <th key={column.title}>{column.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  {field.selectedTable.columns.map((column) => (
                    <td key={column.title}>
                      {getNestedValue(record, column.data) ??
                        getNestedValue(record, column.fallbackData) ??
                        column.fallback ??
                        ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="crud-selected-table-empty">
          {field.selectedTable.emptyMessage}
        </div>
      )}
    </div>
  );
}

function CrudFormModal({
  modalRef,
  title,
  headerColor,
  submitLabel,
  loadingLabel,
  fields,
  form,
  errors,
  selectOptions,
  loading,
  onChange,
  onSubmit,
}) {
  return (
    <div className="modal fade" ref={modalRef}>
      <div className="modal-dialog crud-form-dialog">
        <div className="modal-content">
          <div className={`modal-header bg-${headerColor} text-white`}>
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="modal-body">
              {fields
                .filter((field) => !field.hideOnEdit || !form.id)
                .map((field) => (
                  <div key={field.name} className="crud-field">
                    <label>
                      {field.label}
                      {field.required && (
                        <span className="text-danger"> *</span>
                      )}
                    </label>
                    {field.type === "select" ? (
                      <select
                        className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                        name={field.name}
                        value={form[field.name] || ""}
                        onChange={onChange}
                        disabled={loading || field.disabled}
                      >
                        <option value="">
                          {field.placeholder || `Select ${field.label}`}
                        </option>
                        {(selectOptions[field.name] || field.options || []).map(
                          (option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ),
                        )}
                      </select>
                    ) : field.type === "multi-select" ? (
                      <div
                        className="dropdown crud-multi-select"
                        data-bs-auto-close="outside"
                      >
                        <button
                          className={`form-select text-start ${errors[field.name] ? "is-invalid" : ""}`}
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          disabled={loading || field.disabled}
                        >
                          {(form[field.name] || []).length
                            ? `${(form[field.name] || []).length} employee${(form[field.name] || []).length === 1 ? "" : "s"} selected`
                            : field.placeholder || `Select ${field.label}`}
                        </button>
                        <div className="dropdown-menu w-100 p-2 crud-multi-select-menu">
                          {(selectOptions[field.name] || field.options || [])
                            .length ? (
                            (
                              selectOptions[field.name] ||
                              field.options ||
                              []
                            ).map((option) => (
                              <label
                                className="dropdown-item form-check mb-0"
                                key={option.value}
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={field.name}
                                  value={option.value}
                                  checked={(form[field.name] || [])
                                    .map(String)
                                    .includes(String(option.value))}
                                  onChange={onChange}
                                  disabled={loading || field.disabled}
                                />
                                <span className="form-check-label">
                                  <span>{option.label}</span>
                                  {option.description && (
                                    <small className="d-block text-muted">
                                      Currently: {option.description}
                                    </small>
                                  )}
                                </span>
                              </label>
                            ))
                          ) : (
                            <div className="text-muted px-2 py-1">
                              No employees available.
                            </div>
                          )}
                        </div>
                      </div>
                    ) : field.type === "checkbox-group" ? (
                      <div
                        className={`permission-checklist ${field.grouped ? "permission-checklist-grouped" : ""} ${errors[field.name] ? "is-invalid" : ""}`}
                      >
                        {(selectOptions[field.name] || field.options || []).map(
                          (optionGroup) =>
                            optionGroup.options ? (
                              <div
                                className="permission-group"
                                key={optionGroup.label}
                              >
                                <div className="permission-group-title">
                                  {optionGroup.label}
                                </div>
                                <div className="permission-group-options">
                                  {optionGroup.options.map((option) => (
                                    <label
                                      className="form-check permission-check"
                                      key={option.value}
                                    >
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name={field.name}
                                        value={option.value}
                                        checked={(form[field.name] || [])
                                          .map(String)
                                          .includes(String(option.value))}
                                        onChange={onChange}
                                        disabled={loading || field.disabled}
                                      />
                                      <span className="form-check-label">
                                        {option.label}
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <label
                                className="form-check permission-check"
                                key={optionGroup.value}
                              >
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  name={field.name}
                                  value={optionGroup.value}
                                  checked={(form[field.name] || [])
                                    .map(String)
                                    .includes(String(optionGroup.value))}
                                  onChange={onChange}
                                  disabled={loading || field.disabled}
                                />
                                <span className="form-check-label">
                                  {optionGroup.label}
                                </span>
                              </label>
                            ),
                        )}
                      </div>
                    ) : (
                      <input
                        type={field.type || "text"}
                        className={`form-control ${errors[field.name] ? "is-invalid" : ""}`}
                        name={field.name}
                        value={form[field.name] || ""}
                        placeholder={field.placeholder || ""}
                        onChange={onChange}
                        disabled={loading || field.disabled}
                      />
                    )}
                    {field.type === "multi-select" && (
                      <SelectedRecordsTable
                        field={field}
                        form={form}
                        selectOptions={selectOptions}
                      />
                    )}
                    <div className="invalid-feedback">{errors[field.name]}</div>
                  </div>
                ))}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-with-icon"
                data-bs-dismiss="modal"
                disabled={loading}
              >
                <span className="button-icon" aria-hidden="true">
                  &times;
                </span>
                <span>Cancel</span>
              </button>
              <button
                className={`btn btn-${headerColor} btn-with-icon`}
                type="submit"
                disabled={loading}
              >
                <span className="button-icon" aria-hidden="true">
                  &#10003;
                </span>
                <span>{loading ? loadingLabel : submitLabel}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CrudFormModal;
