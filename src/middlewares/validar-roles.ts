import { Response, NextFunction } from "express";

export const esAdminRole=(req:any,res:Response,next:NextFunction)=>{

    const {usuario}=req;

    if(!usuario){
        return res.status(500).json({
            msg:'Se quiere verificar rol sin validar token'
        });
    }
    
    
    console.log("req.usuari",usuario.roleId);

    if(usuario.roleId !==1){
        return res.status(401).json({
            msg:`${usuario.nombre} no es Administrador.`
        })
    }
    next();

}

