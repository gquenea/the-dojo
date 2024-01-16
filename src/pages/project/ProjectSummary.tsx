import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import useAuthContext from "../../hooks/useAuthContext";
import useFirestore from "../../hooks/useFirestore";

export default function ProjectSummary({ project }: any) {
  const { deleteDocument } = useFirestore("projects");
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleDelete = (e: any) => {
    e.preventDefault();
    deleteDocument(project.id);
    navigate("/");
  };

  return (
    <div>
      <div className="project-summary">
        <h2 className="page-title">{project.name}</h2>
        <p>By {project.createdBy.displayName}</p>
        <p className="due-date">
          Project due by {project.dueDate.toDate().toDateString()}
        </p>
        <p className="details">{project.details}</p>
        <h4>Project is assigned to :</h4>
        <div className="assigned-users">
          {project.assignedUsersList.map((user: any) => (
            <div key={user.id}>
              <Avatar src={user.photoURL} />
            </div>
          ))}
        </div>
      </div>
      {user?.uid === project.createdBy.id && (
        <button className="btn" onClick={handleDelete}>
          Mark as Complete
        </button>
      )}
    </div>
  );
}
