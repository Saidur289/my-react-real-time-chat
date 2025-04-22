import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
    try {
       const {searchTerm} = request.body 
       if(searchTerm === undefined || searchTerm === null){
        return response.status(400).send('Search Term Is Required')
       }
       const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       const regex = new RegExp(sanitizedSearchTerm, "i");
    //    console.log(regex, "contact controller");
       const contacts = await User.find({
        $and: [
            {_id: {$ne: request.userId}},
            {$or: [{firstName: regex}, {lastName: regex}, {email: regex}],}
        ],
       })
    //    console.log({contacts});
       return response.status(200).json({contacts})
    } catch (error) {
        console.log('Error From Search contact function   function Contacts Controller',error);
        return response.status(500).send("Internal Server Error");
        
    }
}