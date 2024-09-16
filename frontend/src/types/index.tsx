export type Login = {
    Username: string,
    Password: string
}

export type Register = {
    Username: string,
    Email: string,
    Password: string,
}

export type Category = {
    ID: number,
    Name: string,
}

export type NoteForm = {
    ID?: number
    Title: string,
    Content: string,
    CategoryID: number,
    UserID?: number,
}

export type CategoryForm = {
    Name: string,
    UserID: number,
}

export type NoteItem = {
    ID: number,
    Title: string,
    Content: string,
    CategoryID: number,
    UserID: number,
    Archived: boolean,
    CreatedAt: Date,
    UpdatedAt: Date
}