"use client";
import Wrapper from "@/app/components/Wrapper";
import { useUser } from "@clerk/nextjs";
import { Project } from "@/type";
import React, { useEffect, useState } from "react";
import { getProjectinfo, deleteTaskById as deleteTaskAction } from "@/app/actions";
import ProjectComponent from "@/app/components/ProjectComponent";
import Link from "next/link";
import { CircleCheck, CopyPlus, ListTodo, Loader, SlidersHorizontal, UserCheck } from "lucide-react";
import Userinfo from "@/app/components/Userinfo";
import EmptyState from "@/app/components/EmptyState";
import TaskComponent from "@/app/components/TaskComponent";
import { toast } from "react-toastify";

const Page = ({ params }: { params: Promise<{ projectId: string }> }) => {
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress;

    const [projectId, setProjectId] = useState("");
    const [project, setProject] = useState<Project | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [assignedFilter, setAssignedFilter] = useState<boolean>(false);
    const [taskcounts, setTaskCounts] = useState({ todo: 0, inProgress: 0, done: 0, assigned: 0 });

    const fetchInfos = async (projectId: string) => {
        try {
            const project = await getProjectinfo(projectId, true);
            setProject(project);
        } catch (error) {
            console.error("Erreur lors du chargement du projet:", error);
        }
    };

    useEffect(() => {
        const getId = async () => {
            const resolvedParams = await params;
            setProjectId(resolvedParams.projectId);
            fetchInfos(resolvedParams.projectId);
        };
        getId();
    }, [params]);

    useEffect(() => {
        if (project && project.tasks && email) {
            const counts = {
                todo: project.tasks.filter(task => task.status === "To Do").length,
                inProgress: project.tasks.filter(task => task.status === "In Progress").length,
                done: project.tasks.filter(task => task.status === "Done").length,
                assigned: project.tasks.filter(task => task.user?.email === email).length,
            };
            setTaskCounts(counts);
        }
    }, [project, email]);

    const filterdTasks = project?.tasks?.filter(task => {
        const statusMatch = !statusFilter || task.status === statusFilter;
        const assignedMatch = !assignedFilter || task.user?.email === email;
        return statusMatch && assignedMatch;
    });

    const handleDeleteTask = async (taskId: string) => {
        try {
            await deleteTaskAction(taskId);
            fetchInfos(projectId);
            toast.success("Tâche supprimée avec succès !");
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de la suppression de la tâche");
        }
    };

    return (
        <Wrapper>
            <div className="md:flex md:flex-row flex-col">
                <div className="md:w-1/4">
                    <div className="p-5 border border-base-300 rounded-xl mb-6">
                        <Userinfo
                            role="Créé par"
                            email={project?.createdBy?.email || null}
                            name={project?.createdBy?.name || null}
                        />
                    </div>
                    <div className="w-full">
                        {project && <ProjectComponent project={project} admin={0} style={false} />}
                    </div>
                </div>
                <div className="mt-6 md:ml-6 md:mt-0 md:w-3/4">
                    <div className="md:flex md:justify-between">
                        <div className="flex flex-col">
                            <div className="space-x-2 mt-2">
                                <button
                                    onClick={() => {
                                        setStatusFilter("");
                                        setAssignedFilter(false);
                                    }}
                                    className={`btn btn-sm ${!statusFilter ? "btn btn-primary" : ""}`}
                                >
                                    <SlidersHorizontal className="w-4" /> Tous ({project?.tasks?.length || 0})
                                </button>

                                <button
                                    onClick={() => {
                                        setStatusFilter("To Do");
                                    }}
                                    className={`btn btn-sm ${statusFilter === "To Do" ? "btn btn-primary" : ""}`}
                                >
                                    <ListTodo className="w-4" /> A faire ({taskcounts.todo})
                                </button>

                                <button
                                    onClick={() => {
                                        setStatusFilter("In Progress");
                                    }}
                                    className={`btn btn-sm ${statusFilter === "In Progress" ? "btn btn-primary" : ""}`}
                                >
                                    <Loader className="w-4" /> En cours ({taskcounts.inProgress})
                                </button>
                            </div>
                            <div className="space-x-2 mt-2">
                                <button
                                    onClick={() => {
                                        setStatusFilter("Done");
                                    }}
                                    className={`btn btn-sm ${statusFilter === "Done" ? "btn btn-primary" : ""}`}
                                >
                                    <CircleCheck className="w-4" /> Finis ({taskcounts.done})
                                </button>

                                <button
                                    onClick={() => {
                                        setAssignedFilter(!assignedFilter);
                                    }}
                                    className={`btn btn-sm ${assignedFilter ? "btn btn-primary" : ""}`}
                                >
                                    <UserCheck className="w-4" /> Vos Tâches ({taskcounts.assigned})
                                </button>
                            </div>
                        </div>
                        <Link href={`/new-tasks/${projectId}`} className="btn btn-sm mt-2 md:mt-0">
                            Nouvelle tâche
                            <CopyPlus className="w-4" />
                        </Link>
                    </div>

                    <div className="mt-6 border border-base-300 p-5 shadow-sm rounded-xl">
                        {filterdTasks && filterdTasks.length > 0 ? (
                            <div className="overflow-auto">
                                <table className="table table-lg">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Titre</th>
                                            <th>Assigné à :</th>
                                            <th className="hidden md:flex">A livrer le :</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterdTasks.map((task, index) => (
                                            <tr key={task.id} className="border-t last:border-none">
                                                <TaskComponent
                                                    task={task}
                                                    index={index}
                                                    onDelete={handleDeleteTask}
                                                    email={email}
                                                />
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <EmptyState
                                imageSrc="/empty-task.png"
                                imageAlt="Picture of an empty project"
                                message="0 tâches à afficher"
                            />
                        )}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default Page;
