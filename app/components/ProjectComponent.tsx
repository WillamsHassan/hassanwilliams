import { Project } from "@/type";
import { Copy, ExternalLink, FolderGit2, Trash } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";
import { toast } from "react-toastify";

interface ProjectProps {
    project: Project;
    admin: number;
    style: boolean,
    onDelete?: (id: string) => void;
}

const ProjectComponent: FC<ProjectProps> = ({ project, admin, style, onDelete }) => {
    const handleDeleteClick = () => {
        const isConfirmed = window.confirm("Êtes-vous sûre de vouloir supprimer ce projet?")
        if (isConfirmed && onDelete) {
            onDelete(project.id)
        }
    }
    const totalTasks = project.tasks?.length;
    const tasksByStatus = project.tasks?.reduce(
        (acc, task) => {
            if (task.status === "To Do") acc.toDo++
            else if (task.status === "In Progress") acc.inProgress++
            else if (task.status === "Done") acc.done++
            return acc
        },
        {
            toDo: 0, inProgress: 0, done: 0
        }
    ) ?? { toDo: 0, inProgress: 0, done: 0 }

    //Creation des fonctions pour manipuler les boutons

    const progressPourcentage = totalTasks ? Math.round((tasksByStatus.done / totalTasks) * 100) : 0
    const inProgressPourcentage = totalTasks ? Math.round((tasksByStatus.inProgress / totalTasks) * 100) : 0
    const toDoPourcentage = totalTasks ? Math.round((tasksByStatus.toDo / totalTasks) * 100) : 0

    const textSizeClass = style ? 'text-sm' : 'text-md'


    const handleCopyCode = async () => {
        if (!project || !project.inviteCode) {
            toast.error("Aucun code d'invitation disponible.");
            return;
        }
    
        try {
            if (!navigator.clipboard) {
                throw new Error("L'accès au presse-papiers n'est pas supporté.");
            }
    
            await navigator.clipboard.writeText(project.inviteCode);
            toast.success("Code d'invitation copié !");
        } catch (error) {
            console.error("Erreur lors de la copie :", error);
            toast.error("Erreur lors de la copie du code d'invitation.");
        }
    };
    

    return (
        <div key={project.id} className={`${style ? 'border border-base-300 p-5 shadow-sm' : ''} text-base-content rounded-xl w-full text-left`}>

            <div className="w-full flex items-center mb-3">
                <div className="bg-primary-content text-xl h-10 w-10 rounded-lg flex justify-center items-center">
                    <FolderGit2 className="w-6 text-primary" />
                </div>
                <div className="badge ml-3 font-semibold">
                    {project.name}
                </div>
            </div>

            {style == true && (
                <p className="text-sm text-gray-500 border border-base-300 p-5 mb-6 rounded-xl">
                    {project.description}
                </p>
            )}

            <div className={"mb-3 "}>
                <span>Collaborateurs</span>
                <div className="badge badge-sm badge-ghost ml-1">{project.users?.length}</div>

            </div>

            {admin === 1 && (
                <div className="flex justify-between items-center rounded-lg p-2 border border-base-300 mb-3 bg-base-200/30">
                    <p className="text-primary font-bold ml-3">
                        {project.inviteCode}
                    </p >
                    <button className="btn btn-sm ml-2" onClick={handleCopyCode}>
                        <Copy className="w-4" />
                    </button>

                </div>
            )}

            <div className="flex flex-col mb-3">
                <h2 className={`text-gray-500 mb-2 ${textSizeClass}`}>
                    <span className="font-bold ">A faire</span>
                    <div className="badge badge-ghost badge-sm ml-1">
                        {tasksByStatus.toDo}
                    </div>
                </h2>
                <progress className="progress progress-primary w-full" value={toDoPourcentage} max="100"></progress>
                <div className="flex">
                    <span className={`text-gray-400 mt-2  ${textSizeClass}`}>
                        {toDoPourcentage}%
                    </span>
                </div>
            </div>


            <div className="flex flex-col mb-3">
                <h2 className={`text-gray-500 mb-2 ${textSizeClass}`}>
                    <span className="font-bold ">En cours</span>
                    <div className="badge badge-ghost badge-sm ml-1">
                        {tasksByStatus.inProgress}
                    </div>
                </h2>
                <progress className="progress progress-primary w-full" value={inProgressPourcentage} max="100"></progress>
                <div className="flex">
                    <span className={`text-gray-400 mt-2  ${textSizeClass}`}>
                        {inProgressPourcentage}%
                    </span>
                </div>
            </div>


            <div className="flex flex-col mb-3">
                <h2 className={`text-gray-500 mb-2 ${textSizeClass}`}>
                    <span className="font-bold ">Terminée(s)</span>
                    <div className="badge badge-ghost badge-sm ml-1">
                        {tasksByStatus.done}
                    </div>
                </h2>
                <progress className="progress progress-primary w-full" value={progressPourcentage} max="100"></progress>
                <div className="flex">
                    <span className={`text-gray-400 mt-2  ${textSizeClass}`}>
                        {progressPourcentage}%
                    </span>
                </div>
            </div>

            <div className="flex">
                {style && (
                    <Link className="btn btn-primary btn-sm " href={`/project/${project.id}`}>
                        <div className="badge badge-sm">
                            {totalTasks}
                        </div>
                        Tâche
                        <ExternalLink className="w-4" />
                    </Link>

                )}
                {admin === 1 && (
                    <button className="btn btn-sm ml-3" onClick={handleDeleteClick}>

                        <Trash className="w-4" />
                    </button>
                )}
            </div>

        </div>
    )
}

export default ProjectComponent