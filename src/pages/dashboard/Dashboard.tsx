import useCollection from "../../hooks/useCollection";
import "./Dashboard.css";
import ProjectList from "../../components/ProjectList";
import ProjectFilter from "./ProjectFilter";
import { useState } from "react";
import useAuthContext from "../../hooks/useAuthContext";

export default function Dashboard() {
  const { documents, error } = useCollection("projects");
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const { user } = useAuthContext();

  const changeFilter = (newFilter: any) => {
    setCurrentFilter(newFilter);
  };

  const projects = documents
    ? documents.filter((document: any) => {
        switch (currentFilter) {
          case "all":
            return true;
          case "mine":
            let assignedToMe = false;
            document.assignedUsersList.forEach((u: any) => {
              if (user?.uid === u.id) {
                assignedToMe = true;
              }
            });
            return assignedToMe;
          case "development":
          case "design":
          case "sales":
          case "marketing":
            return document.category === currentFilter;
          default:
            return true;
        }
      })
    : null;

  return (
    <div>
      <h2 className="page-title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {documents && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  );
}
