import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button";
import { Dialog } from "../../../../components/Dialog";
import InputField from "../../../../components/InputField";
import { LoadingSpinner } from "../../../../components/LoadingSpinner";
import { Pagination } from "../../../../components/Pagination";
import { SearchForm } from "../../../../components/SearchForm";
import { useLoading } from "../../../../hooks/useLoading";
import { createField, deleteField } from "../../../../services/admin";
import { getFields } from "../../../../services/job";

export const Fields = () => {
  const [fields, setFields] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageCount: 0,
    pageSize: 10,
    totalRecords: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const { isLoading, setIsLoading } = useLoading();
  const [openDelete, setOpenDelete] = useState(false);
  const [idToDelete, setIdToDelete] = useState();
  const [openCreate, setOpenCreate] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
  });
  const [createError, setCreateError] = useState();

  const handleCreate = (e) => {
    e.preventDefault();
    if (createFormData.name === "") {
      setCreateError("Name is required");
      return;
    }
    setIsLoading(true);
    createField(createFormData)
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
        setOpenCreate(false);
        toast.success("Field created successfully");
        fetchFields();
      });
  };

  const handleDelete = () => {
    setIsLoading(true);
    deleteField(idToDelete)
      .catch((error) => {
        console.log(error);
        toast.error("Trouble deleting field");
      })
      .finally(() => {
        setIsLoading(false);
        fetchFields();
        toast.success("Field deleted successfully");
      });
  };

  const fetchFields = async () => {
    setIsLoading(true);
    await getFields({
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      search: searchQuery,
      orderBy: sortConfig.key,
      isDescending: sortConfig.direction === "descending",
    })
      .then((response) => {
        setFields(response.data || []);
        setPagination({
          ...pagination,
          pageCount: response.totalPages,
          totalRecords: response.totalRecords,
        });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchFields();
  }, [sortConfig, searchQuery, pagination.pageIndex, pagination.pageSize]);

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <SearchForm
          setSearch={(query) => {
            setSearchQuery(query);
            setPagination({ ...pagination, pageIndex: 1 });
          }}
          onSubmit={fetchFields}
        />
        <Button
          variant={"red"}
          onClick={() => {
            setOpenCreate(true);
          }}
        >
          Create a new Field
        </Button>
      </div>
      <div className="bg-white shadow-lg rounded-lg overflow-auto border border-gray-200">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("name")}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  Field name{" "}
                  {sortConfig.key === "name" &&
                    (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>

                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fields.length > 0 ? (
                fields.map((field, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:cursor-pointer`}
                    onClick={() => {}}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {field.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <Button
                        variant={"red"}
                        onClick={() => {
                          setOpenDelete(true);
                          setIdToDelete(field.id);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                  >
                    No result
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-4">
        <Pagination
          {...pagination}
          setPage={(page) => {
            setPagination({ ...pagination, pageIndex: page });
          }}
        />
      </div>
      <Dialog
        open={openDelete}
        setOpen={setOpenDelete}
        onConfirm={handleDelete}
        description={"Do you want to delete this field?"}
      />
      <Dialog open={openCreate} setOpen={setOpenCreate}>
        <form className="flex flex-col gap-2 px-2" onSubmit={handleCreate}>
          <div>
            <InputField
              name={"name"}
              id={"name"}
              label={"Field name"}
              placeholder={"Enter field name"}
              onChange={(e) => {
                setCreateFormData({ ...createFormData, name: e.target.value });
              }}
            />
            {createError && (
              <div className="italic text-red-600 text-sm text-right">
                {createError}
              </div>
            )}
          </div>

          <Button variant={"red"} className="flex-grow-0 ">
            Create
          </Button>
        </form>
      </Dialog>
    </div>
  );
};
