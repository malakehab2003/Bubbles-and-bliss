import { ItemCategory, Government, City } from "../models/db.js";


export const validateName = (name) => {
    if (!name || name === '' || name.length < 2) {
        throw new Error('Name error');
    }
}


export const validateDob = (dob) => {
    if (!dob || dob === '') {
        throw new Error('Age error');
    }
    
    const birthDate = new Date(dob);
    if (isNaN(birthDate.getTime())) {
        throw new Error("Invalid date of birth");
    }

    const today = new Date();

    if (birthDate >= today) {
        throw ("Date of birth must be in the past");
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    if (age < 0) {
        throw ("User must be at least 0 years old");
    }

    if (age > 100) {
        throw new Error("Invalid date of birth");
    }

    return true;
}



export const validateEmail = (email) => {
    if (!email || email === '') {
        throw new Error('Email error');
    }
    
    const regex = /^[^\s@]+@(gmail|yahoo|outlook|email)\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
    
    if (!regex.test(email)) {
        throw new Error('Email error');
    }
}



export const validatePassword = (password) => {
    if (!password || password === '') {
        throw new Error('Password error');
    }
    
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{7,}$/;
    if (!regex.test(password)) {
        throw new Error('Password error');
    }
}



export const validateGender = (gender) => {
    if (!gender || gender === '') {
        throw new Error('Gender error');
    }
    
    const allowedGenders = ["male", "female"];
    
    if (!allowedGenders.includes(gender.toLowerCase())) {
        throw new Error('Gender error');
    }
}



export const validatePhone = (phone) => {
    if (!phone || phone === '') {
        throw new Error('Phone error');
    }
    
    const regex = /^(\+2)?01[0125][0-9]{8}$/;
    if (!regex.test(phone)) {
        throw new Error('Phone error');
    }
}


export const validateImageUrl = (image_url) => {
    if (!image_url || typeof image_url !== 'string') {
        throw new Error('Invalid image URL');
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    const isValid = allowedExtensions.some(ext =>
        image_url.toLowerCase().endsWith(ext)
    );

    if (!isValid) {
        throw new Error("Image URL is not valid");
    }

    return true;
};


export const validateUserData = (userData) => {
    try {
        validateDob(userData.dob);
        validateName(userData.name);
        validateEmail(userData.email);
        validatePassword(userData.password);
        validateGender(userData.gender);
        
        if (userData.phone) {
            validatePhone(userData.phone);
        }
        
        if (userData.image_url) {
            validateImageUrl(userData.image_url);
        }
    } catch (err) {
        throw new Error(err)
    }
}

/////////////////////////////////////////////


export const validateType = (type) => {
    const validTypes = ['lost', 'found'];

    if (!type || !validTypes.includes(type.toLowerCase())) {
        throw new Error("No type found");
    }
}


export const validateId = (id) => {
    if (!id) {
        throw new Error('ID is required');
    }

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
        throw new Error('Invalid ID');
    }

    return parsedId;
}


export const validateCategoryId = async (id) => {
    validateId(id);
    const category = await ItemCategory.findByPk(id);
    if (!category) {
        throw new Error('Category not found');
    }
}


export const validateGovernmentId = async (id) => {
    validateId(id);
    const government = await Government.findByPk(id);
    if (!government) {
        throw new Error('Government not found');
    }
}


export const validateCityId = async (id, government_id) => {
    validateId(id);
    const city = await City.findOne({
        where: { id, government_id }
    });

    if (!city) {
        throw new Error('City does not belong to selected government');
    }
}


export const validateDate = (date) => {
    if (!date) {
        throw new Error('Date is required');
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
    }

    if (parsedDate > new Date()) {
        throw new Error('Date cannot be in the future');
    }

    return parsedDate;
};


export const validateItemData = async (government_id, category_id, city_id, type, date) => {
    if (category_id) await validateCategoryId(category_id);
    if (government_id) {
        await validateGovernmentId(government_id);
        await validateCityId(city_id, government_id);
    }
    if (type) validateType(type);
    if (date) validateDate(date)
}
