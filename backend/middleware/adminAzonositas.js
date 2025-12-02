 import jwt from 'jsonwebtoken'

 const adminAzonositas = async(req,res,next)=>{

    try {
        const {token} = req.cookies
        if(!token){
            return res.json({siker:false, uzenet: "Nem sikerült, jelentkezzen be újra!"})
        }
            
            const tokenVisszaallit = jwt.verify(token, process.env.JWT_SECRET)
    
            if(tokenVisszaallit !== process.env.ADMIN_EMAIL+process.env.ADMIN_PASSWORD){
                return res.json({siker:false, uzenet: "Nem sikerült, jelentkezzen be újra!"})
            }
    
            next();
    
        } catch (error) {
            console.log(error);
            return res.json({siker: false, uzenet: error.message})
    
        }
 }

 export default adminAzonositas