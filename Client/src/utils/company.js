export const getCompany = () => {

  return JSON.parse(
    localStorage.getItem(
      "company"
    )
  );

};

export const getCompanyId = () => {

  const company =
    getCompany();

  return company?._id;

};