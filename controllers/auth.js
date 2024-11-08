
const { response } = require('express');
const bcrypt = require('bcryptjs')
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario=async(req,res = response)=>{
  
  const{ email, password} = req.body
  try {
    let usuario = await Usuario.findOne({email});
    if(usuario){
      return res.status(400).json({
        ok:false,
        msg: 'Un usuario existe con ese correo',
      })
    }
    usuario = new Usuario(req.body);
    
    //encriptar contrasena
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password,salt);

    await usuario.save()
    // generar JWT
    const token = await generarJWT(usuario.id,usuario.name)


    res.status(201).json({
      ok:true,
      uid:usuario.id,
      name:usuario.name,
      token
    })
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok:false,
      msg: 'por favor hable con el administrador',
    })
  }
};

const loginUsuario =async(req,res = response)=>{
  const{ email, password} = req.body
  try {
    const usuario = await Usuario.findOne({email});
    if(!usuario){
      return res.status(400).json({
        ok:false,
        msg: 'el usuario no existe con ese email',
      })
    }

    //confirmar contrasena
    const validPassword = bcrypt.compareSync(password,usuario.password);
    if(!validPassword){
      return res.status(400).json({
        ok:false,
        msg: 'Passwotd incorrecto'
      })
    }

    //generar JWT
    const token = await generarJWT(usuario.id,usuario.name)

    // generar nuestro jsonlet
    res.json({
      ok:true,
      uid: usuario.id,
      name:usuario.name,
      token
    })

  } catch (error) {
    console.log(error);
      return res.status(500).json({
        ok:false,
        msg: 'por favor hable con el administrador',
      })
  }
};


const revalidarToken = async(req,res = response)=>{
  const uid = req.uid;
  const name = req.name

  const token = await generarJWT(uid,name)
  

  res.json({
    ok:true,
    uid,
    name,
    token
  })
};



module.exports={
  crearUsuario,
  loginUsuario,
  revalidarToken
}