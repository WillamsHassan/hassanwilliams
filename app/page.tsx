"use client";
import Wrapper from "./components/Wrapper";
import { useEffect, useState } from "react";
import { FolderGit2 } from "lucide-react";
import { createProject, deleteProjectById, getProjectsCreatedByUser } from "./actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Project } from "@/type";
import ProjectComponent from "./components/ProjectComponent";
import EmptyState from "./components/EmptyState";

// Définition d'un type étendu si les données API ne correspondent pas exactement à Project
interface ExtendedProject extends Project {
  users?: { id: string; name: string; email: string }[];
}

export default function Home() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);

  // Fonction pour récupérer les projets créés par l'utilisateur
  const fetchProjects = async (email: string) => {
    try {
      const myProject = await getProjectsCreatedByUser(email);

      // Vérifier que les projets renvoyés ont bien la structure attendue
      const formattedProjects: Project[] = myProject.map((project: ExtendedProject) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        inviteCode: project.inviteCode,
        createdById: project.createdById,
      }));

      setProjects(formattedProjects);
      console.log(formattedProjects);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  };

  useEffect(() => {
    if (email) {
      fetchProjects(email);
    }
  }, [email]);

  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectById(projectId);
      await fetchProjects(email);
      toast.success("Projet supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression du projet");
      console.error("Erreur lors de la suppression du projet :", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const modal = document.getElementById("my_modal_3") as HTMLDialogElement;
      await createProject(name, description, email);
      if (modal) modal.close();
      setName("");
      setDescription("");
      await fetchProjects(email);
      toast.success("Projet créé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la création du projet");
      console.error("Erreur lors de la création du projet :", error);
    }
  };

  return (
    <Wrapper>
      <div>
        {/* Bouton pour ouvrir la modal */}
        <button
          className="btn btn-primary mb-6"
          onClick={() => (document.getElementById("my_modal_3") as HTMLDialogElement)?.showModal()}
        >
          Nouveau Métier <FolderGit2 />
        </button>

        {/* Modal de création */}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Nouveau Métier</h3>
            <p className="py-4">Décrivez votre métier simplement grâce à la description</p>
            <div>
              <input
                placeholder="Nom du métier"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border border-base-300 input input-bordered w-full mb-4 placeholder:text-sm"
                required
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-2 textarea textarea-bordered border border-base-300 w-full textarea-md placeholder:text-sm"
              ></textarea>
              <button className="btn btn-primary" onClick={handleSubmit}>
                Nouveau Métier <FolderGit2 />
              </button>
            </div>
          </div>
        </dialog>

        {/* Affichage des projets */}
        <div className="w-full">
          {projects.length > 0 ? (
            <ul className="w-full grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectComponent
                    project={project}
                    admin={1}
                    style={true}
                    onDelete={deleteProject}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState imageSrc="/empty-projet.png" imageAlt="Image d'un projet vide" message="Aucun projet créé" />
          )}
        </div>
      </div>
    </Wrapper>
  );
}
