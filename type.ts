import {Project as PrismaProject, Task as PrismaTask, User} from '@prisma/client'
//import { User, User } from 'lucide-react';


//Fusion du type PrismaProject avec vos propriétés supplementaires

export type Project = PrismaProject & {
    totalTask? : number;
    collaboratorsCount?: number
    taskStates?:{
        toDo: number;
        inProgress: number;
        done: number;
    };
    percentages?:{
        progressPercentage: number;
        inProgressPercentage: number;
        toDoPercentage: number;
    };
    tasks?: Task[]; // Assurez vous que la relation Task est incluse
     users?: User[];
     createdBy?: User,
};

export type Task = PrismaTask &{
    user? : User | null;
    createdBy?: User | null;
}