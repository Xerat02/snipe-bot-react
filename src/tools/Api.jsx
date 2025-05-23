const createFilterObject = (filter, page = 1) => {
  if (!filter) return new URLSearchParams({ page: page });
  let params = new URLSearchParams(filter);
  params.set("page", page);
  return params;
};

const fetchData = async (endpoint, filter = null, page = 1) => {
  try {
    const params = createFilterObject(filter, page);
    const url = `${endpoint}?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export { fetchData };
