import React from "react";

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
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className={`modal-header bg-${headerColor} text-white`}>
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>

                    <form onSubmit={onSubmit}>
                        <div className="modal-body">
                            {fields
                                .filter((field) => !field.hideOnEdit || !form.id)
                                .map((field) => (
                                <div key={field.name} className="crud-field">
                                    <label>
                                        {field.label}
                                        {field.required && <span className="text-danger"> *</span>}
                                    </label>
                                    {field.type === "select" ? (
                                        <select
                                            className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                                            name={field.name}
                                            value={form[field.name] || ""}
                                            onChange={onChange}
                                            disabled={loading || field.disabled}
                                        >
                                            <option value="">{field.placeholder || `Select ${field.label}`}</option>
                                            {(selectOptions[field.name] || field.options || []).map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.type === "checkbox-group" ? (
                                        <div className={`permission-checklist ${field.grouped ? "permission-checklist-grouped" : ""} ${errors[field.name] ? "is-invalid" : ""}`}>
                                            {(selectOptions[field.name] || field.options || []).map((optionGroup) => (
                                                optionGroup.options ? (
                                                    <div className="permission-group" key={optionGroup.label}>
                                                        <div className="permission-group-title">{optionGroup.label}</div>
                                                        <div className="permission-group-options">
                                                            {optionGroup.options.map((option) => (
                                                                <label className="form-check permission-check" key={option.value}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        name={field.name}
                                                                        value={option.value}
                                                                        checked={(form[field.name] || []).map(String).includes(String(option.value))}
                                                                        onChange={onChange}
                                                                        disabled={loading || field.disabled}
                                                                    />
                                                                    <span className="form-check-label">{option.label}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <label className="form-check permission-check" key={optionGroup.value}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            name={field.name}
                                                            value={optionGroup.value}
                                                            checked={(form[field.name] || []).map(String).includes(String(optionGroup.value))}
                                                            onChange={onChange}
                                                            disabled={loading || field.disabled}
                                                        />
                                                        <span className="form-check-label">{optionGroup.label}</span>
                                                    </label>
                                                )
                                            ))}
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
                                <span className="button-icon" aria-hidden="true">&times;</span>
                                <span>Cancel</span>
                            </button>
                            <button className={`btn btn-${headerColor} btn-with-icon`} type="submit" disabled={loading}>
                                <span className="button-icon" aria-hidden="true">&#10003;</span>
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
