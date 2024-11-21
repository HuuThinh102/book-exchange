export interface Book{
    id: string,
    title: string,
    authors?: string,
    publisher?:string,
    owner?: string,
    status?: string,
    image?: string,
    create_at?: string,
    category?: string,
    active?: boolean,
    owner_phone_number?: string,
    is_approved?: boolean,
}

