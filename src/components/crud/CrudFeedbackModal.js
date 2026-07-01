import React from "react";

function CrudFeedbackModal({ modalRef, modalConfig, loading, cleanupModal }) {
    return (
        <div className="modal fade" ref={modalRef}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className={`modal-header bg-${modalConfig.color} text-white`}>
                        <h5 className="modal-title">{modalConfig.title}</h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            disabled={loading}
                        ></button>
                    </div>

                    <div className="modal-body text-center">
                        <p className="mb-0">{modalConfig.message}</p>
                    </div>

                    <div className="modal-footer justify-content-center">
                        {modalConfig.type === "delete" ? (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-with-icon"
                                    data-bs-dismiss="modal"
                                    disabled={loading}
                                >
                                    <span className="button-icon" aria-hidden="true">&times;</span>
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-danger btn-with-icon"
                                    onClick={modalConfig.action}
                                    disabled={loading}
                                >
                                    <span className="button-icon" aria-hidden="true">&#128465;</span>
                                    <span>{loading ? "Deleting..." : "Delete"}</span>
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className={`btn btn-${modalConfig.color} btn-with-icon`}
                                data-bs-dismiss="modal"
                                onClick={cleanupModal}
                                disabled={loading}
                            >
                                <span className="button-icon" aria-hidden="true">&#10003;</span>
                                <span>OK</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CrudFeedbackModal;
