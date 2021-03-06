const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcrypt')

const helpers = require("../helpers/helpers.js");

let rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE", "WORKER_ROLE"],
    message: "{VALUE} no es un rol válido"
};

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es necesario"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "El correo es necesario"]
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"]
    },
    role: {
        type: String,
        default: "USER_ROLE",
        enum: rolesValidos
    },
    status: {
        type: Boolean,
        default: true
    },
    token_verify: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.methods.encryptPassword = async password => {
    return await bcrypt.hash(password, 10);
};

usuarioSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

usuarioSchema.methods.genTokenVerifica = async function() {
    return await bcrypt.hash(helpers.randomString(), 10);
};

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    delete userObject.token_verify;

    return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: "{PATH} debe de ser único" });

module.exports = mongoose.model("Usuario", usuarioSchema);