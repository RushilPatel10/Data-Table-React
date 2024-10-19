import { useEffect, useState } from "react";

function Form() {
  const [student, setStudent] = useState({});
  const [list, setList] = useState([]);
  const [index, setIndex] = useState(-1);
  const [error, setError] = useState({});
  const [hobby, setHobby] = useState([]);
  const [search, setSearch] = useState("");
  const [symbol, setSymbol] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(list.length / itemsPerPage);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("studentlist")) || [];
    setList(storedList);
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    const newHobby = [...hobby];
    if (name === "hobby") {
      e.target.checked ? newHobby.push(value) : newHobby.splice(newHobby.indexOf(value), 1);
      setHobby(newHobby);
      setStudent({ ...student, [name]: newHobby });
    } else {
      setStudent({ ...student, [name]: value });
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!student.id) tempErrors.id = "Id is required.";
    if (!student.name) tempErrors.name = "Name is required.";
    if (!student.email) tempErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(student.email)) tempErrors.email = "Invalid Email.";
    if (!student.hobby?.length) tempErrors.hobby = "Hobby is required.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const newList = index !== -1 ? list.map((item, i) => (i === index ? student : item)) : [...list, student];
    setList(newList);
    localStorage.setItem("studentlist", JSON.stringify(newList));
    resetForm();
  };

  const resetForm = () => {
    setStudent({});
    setHobby([]);
    setIndex(-1);
    setError({});
  };

  const deleteData = (pos) => {
    const updatedList = list.filter((_, i) => i !== pos);
    setList(updatedList);
    localStorage.setItem("studentlist", JSON.stringify(updatedList));
  };

  const editData = (pos) => {
    const editStudent = list[pos];
    setStudent(editStudent);
    setIndex(pos);
    setHobby(editStudent.hobby);
  };

  const handleSearch = (e) => setSearch(e.target.value);

  const sortBy = (type) => {
    const sortedList = [...list].sort((a, b) => 
      symbol === "" || symbol === "^" 
        ? b[type].localeCompare(a[type]) 
        : a[type].localeCompare(b[type])
    );
    setSymbol(symbol === "^" ? "v" : "^");
    setList(sortedList);
  };

  return (
    <div className="dark-theme">
      <h2 className="form-header">Student Registration</h2>
      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Id</label>
          <input type="text" name="id" value={student.id || ""} onChange={handleInput} />
          {error.id && <span className="error-text">{error.id}</span>}
        </div>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={student.name || ""} onChange={handleInput} />
          {error.name && <span className="error-text">{error.name}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={student.email || ""} onChange={handleInput} />
          {error.email && <span className="error-text">{error.email}</span>}
        </div>
        <div className="form-group">
          <label>Hobby</label>
          <div className="checkbox-group">
            {["Dance", "Read", "Write", "Yoga"].map((hobbyItem) => (
              <label key={hobbyItem}>
                <input
                  type="checkbox"
                  name="hobby"
                  value={hobbyItem}
                  onChange={handleInput}
                  checked={hobby.includes(hobbyItem)}
                />
                {hobbyItem}
              </label>
            ))}
          </div>
          {error.hobby && <span className="error-text">{error.hobby}</span>}
        </div>
        <div className="form-group">
          <input type="submit" className="btn-submit" value={index !== -1 ? "Edit Data" : "Add Data"} />
        </div>
      </form>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          onChange={handleSearch}
        />
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>
              <button onClick={() => sortBy("name")}>Name {symbol}</button>
            </th>
            <th>
              <button onClick={() => sortBy("email")}>Email {symbol}</button>
            </th>
            <th>Hobby</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems
            .filter((val) => {
              if (!search) return val;
              return (
                val.name.toLowerCase().includes(search.toLowerCase()) ||
                val.email.toLowerCase().includes(search.toLowerCase())
              );
            })
            .map((studentItem, i) => (
              <tr key={i}>
                <td>{studentItem.id}</td>
                <td>{studentItem.name}</td>
                <td>{studentItem.email}</td>
                <td>{studentItem.hobby?.join(", ") || "No Hobby"}</td>
                <td>
                  <button onClick={() => editData(i)}>Edit</button>
                  <button onClick={() => deleteData(i)}>Delete</button>
                </td>
              </tr>
            ))}
          <tr>
            <td colSpan="5">
              <div className="pagination">
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
                )}
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={currentPage === i + 1 ? "active" : ""}
                  >
                    {i + 1}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Form;
