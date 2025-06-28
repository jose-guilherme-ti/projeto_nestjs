import { IsNotEmpty, Length } from "class-validator";

export class CreateTeamMemberBody {
    @IsNotEmpty()
    @Length(5, 100)
    name: string;
    
    @IsNotEmpty({
        message:'Esse dado nao pode ficar em branco'
    })
    function: string
}