"use client"
import Image from "next/image";
import Wrapper from "./components/Wrapper";
import { useEffect, useState } from "react";
import { FolderGit2 } from "lucide-react";
import { createProject, deleteProjectById, getProjectsCreatedByUser } from "./actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { Project } from "@/type";
import ProjectComponent from "./components/ProjectComponent";
import EmtyState from "./components/EmptyState";


export default function Home() {

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress as string;
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [projects, setProjects] = useState<Project[]>([])


  const fetchProjects = async (email: string) => {
    try {
      const myproject = await getProjectsCreatedByUser(email)
      setProjects(myproject)
      console.log(myproject)

    } catch (error) {
      console.error("Error lors du chargements des métiers:", error)
    }

  }
// utiliser un utilisateur 

  useEffect(() => {
    if (email) {
      fetchProjects(email)
    }
  }, [email])


  const deleteProject = async (projectId: string) => {
    try {
      await deleteProjectById(projectId)
      fetchProjects(email)
      toast.success("Project supprimé avec succès")

    } catch (error) {
      throw new Error("Error deleting project : " + error);

    }

  }

  const handleSumit = async () => {
    try {
      const modal = document.getElementById('my_modal_3') as HTMLDialogElement
      const project = await createProject(name, description, email)
      if (modal) {
        modal.close()
      }
      setName(""),
        setDescription("")
      fetchProjects(email)
      toast.success("Métiers crées")

    } catch (error) {
      console.error("Error creating jobness:", error)
    }
  }


  return (
    <Wrapper>
      <div>
        {/* You can open the modal using document.getElementById('ID').showModal() method */}
        <button className="btn  btn-primary mb-6" onClick={() => (document.getElementById('my_modal_3') as HTMLDialogElement).showModal()}>Nouveau Métier <FolderGit2 /></button>
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
            </form>
            <h3 className="font-bold text-lg">Nouveau Metier</h3>
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
                className="mb-2 textarea textarea-bordered border border-base-300 w-full textarea-md placceholder::text-sm"
              >
              </textarea>
              <button className="btn btn-primary" onClick={handleSumit}>
                Nouveau Métier <FolderGit2 />

              </button>
            </div>
          </div>
        </dialog>

        <div className="w-full ">
          {projects.length > 0 ? (
            <ul className="w-full grid md:grid-cols-3 gap-6">
              {projects.map((project) => (
                <li key={project.id}>
                  <ProjectComponent project={project} admin={1} style={true} onDelete={deleteProject}></ProjectComponent>
                </li>
              ))}
            </ul>

          ) : (

            <div>
             <EmtyState 
             imageSrc="/empty-projet.png"
             imageAlt="Picture of an empty project"
             message="Aucun projet créer"
             
             
             />
            </div>
          )}
        </div>


      </div>
    </Wrapper>
  );
}

