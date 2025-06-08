// public/js/blog.js
const filterBlog = document.querySelector("[filterBlog]");

if (filterBlog) {
  const filterSelect = filterBlog.querySelector("[filter-blog-select]");
  const filterClear = filterBlog.querySelector("[filter-clear]");

  // Hàm redirect dựa trên slug chuyên mục
  const applyCategoryFilter = slug => {
    const path = (slug ? `/blogs/${slug}` : '/blogs');

    window.location.href = path;
  };

  // Khi user chọn chuyên mục
  filterSelect.addEventListener("change", e => {
    applyCategoryFilter(e.target.value);
  });

  // Khi user nhấn Clear
  filterClear.addEventListener("click", () => {
    filterSelect.value = "";
    applyCategoryFilter("");
  });
}
