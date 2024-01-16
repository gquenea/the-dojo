import { useEffect, useState } from "react";
import "./Create.css";
import { IUser } from "../../instances/IUser";
import Select from "react-select";
import useCollection from "../../hooks/useCollection";
import { timestamp } from "../../firebase/config";
import useAuthContext from "../../hooks/useAuthContext";
import useFirestore from "../../hooks/useFirestore";
import { Navigate, useNavigate } from "react-router-dom";

const categories = [
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
];

export default function Create() {
  const [name, setName] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<any>(null);
  const [assignedUsers, setAssignedUsers] = useState<any[]>([]);

  const [formError, setFormError] = useState<string | null>(null);
  const { user } = useAuthContext();
  const { addDocument, response } = useFirestore("projects");
  const navigate = useNavigate();

  const { documents } = useCollection("users");
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    if (documents) {
      const options = documents.map((user: IUser) => {
        return { value: user, label: user.displayName };
      });
      setUsers(options);
    }
  }, [documents]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setFormError(null);
    if (!category) {
      setFormError("Please select a project category");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id,
      };
    });

    const createdBy = {
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      id: user?.uid,
    };

    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList,
    };
    await addDocument(project);

    navigate("/");
  };

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name :</span>
          <input
            required
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project details :</span>
          <textarea
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>
        <label>
          <span>Set dueDate :</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(new Date(e.target.value))}
            value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
          />
        </label>
        <label>
          <span>Project category : </span>
          <Select
            onChange={(option) => setCategory(option)}
            menuPlacement="top"
            options={categories}
          />
        </label>
        <label>
          <span>Assign to : </span>
          <Select
            onChange={(option: any) => setAssignedUsers(option)}
            options={users}
            menuPlacement="top"
            isMulti
          />
        </label>
        <button className="btn">Add Project</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
}
