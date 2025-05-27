module.exports = (query, statusList) => {
  const filterStatus = statusList.map(item => ({
    ...item,
    class: "" // reset
  }));

  const index = query.status
    ? filterStatus.findIndex(item => item.status === query.status)
    : filterStatus.findIndex(item => item.status === "");

  if (index !== -1) {
    filterStatus[index].class = "active";
  }

  return filterStatus;
};
