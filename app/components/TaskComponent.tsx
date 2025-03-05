import { Task } from "@/type";
import React, { FC } from "react";
import Userinfo from "./Userinfo";
import Link from "next/link";
import { ArrowRight, Trash } from "lucide-react";

interface TaskProps {
    task: Task,
    index: number,
    email?: string,
    onDelete?: (id: string) => void
}

const TaskComponent: FC<TaskProps> = ({ task, index, email, onDelete }) => {
    const handleDeleteClick = () =>{
        if(onDelete){
            onDelete(task.id)
        }
    }

    const canDelete = email == task.createdBy?.email

    return (
        < >
            <td>{index + 1}</td>
            <td>
                <div className="flex flex-col">
                    <div className={`badge text-xs mb-2 font-semibold
                    ${task.status == "To Do" ? "bg-red-500 font-semibold" : ""}
                     ${task.status == "In Progress" ? "bg-yellow-500 font-semibold" : ""}
                      ${task.status == "Done" ? "bg-green-500 font-semibold" : ""}
                    `}>
                        {task.status == "To Do" && 'A faire'}
                        {task.status == "In Progress" && 'En cours'}
                        {task.status == "Done" && 'Terminée(s)'}

                    </div>
                    <span className="text-sm font-bold">
                        {task.name.length > 100 ? `${task.name.slice(0, 100)}... ` : task.name}
                    </span>
                </div>
            </td>

            <td>
                <Userinfo
                    role=""
                    email={task.user?.email || null}
                    name={task.user?.name || null}

                />
            </td>

            <td>
                <div className="text-xs text-gray-500 hidden md:flex">
                    {task.dueDate && new Date(task.dueDate).toLocaleDateString()}
                </div>
            </td>

            <td>
                <div className="flex h-fit">
                    <Link className="btn btn-primary" href={`/task-details/${task.id}`}>
                        Plus
                        <ArrowRight className="w-4 " />
                    </Link>
                    {canDelete &&(
                        <button onClick={handleDeleteClick} className="btn btn-sm ml-2 bg-red-300 rounded-xl">
                            <Trash className="w-4" />
                        </button>
                    )}
                </div>
            </td>
        </>
    )
}

export default TaskComponent