import mongoose from 'mongoose'

const mongodbCsatlakozás = async ()=>{

    mongoose.connection.on('connected',()=>{
        console.log("Adatbázis megy");
        
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/sneakyshoes`)
}

export default mongodbCsatlakozás