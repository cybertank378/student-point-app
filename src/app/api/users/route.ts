import {userController} from "@/app/api/users/_factory";


export async function GET(request: Request) {
    return userController.list(request);
}

export async function POST(request: Request) {
    return userController.create(request);
}
