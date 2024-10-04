export class Category {
    constructor(
        public id: number,        
        public label: string,     
        public parentId: number | null,
    ) {}
}
