export type Login = {
    username: string,
    password: string
}

export type Register = {
    username: string,
    email: string,
    password: string,
}

export type Category = {
    ID: number,
    name: string,
}

export type NoteForm = {
    id?: number
    title: string,
    content: string,
    category_id: number,
    user_id?: number,
}

export type CategoryForm = {
    name: string,
    user_id: number,
}

export type NoteItem = {
    ID: number,
    title: string,
    content: string,
    category_id: number,
    user_id: number,
    archived: boolean,
    CreatedAt: Date,
    UpdatedAt: Date
}