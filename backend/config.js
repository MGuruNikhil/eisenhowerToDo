import 'dotenv/config'

export const PORT = 5555;
export const mongoDBURL =  "mongodb+srv://"+process.env.MONGO_NAME+":"+process.env.MONGO_PASSWORD+"@cluster0.d17iwyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";