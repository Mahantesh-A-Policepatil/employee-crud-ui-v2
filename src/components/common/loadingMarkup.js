export const loaderTileIndexes = Array.from({ length: 12 }, (_, index) => index);

const loaderTiles = loaderTileIndexes
  .map(
    (index) => `<span class="loading-indicator__tile" style="--loader-index:${index}"></span>`,
).join("");

export const dataTableLoadingMarkup = `
  <div class="loading-indicator loading-indicator--table" role="status" aria-label="Loading">
    <div class="loading-indicator__ring" aria-hidden="true">${loaderTiles}</div>
    <span class="loading-indicator__label">Loading...</span>
  </div>
`;
