const { Router } = require("express");
const { getEvento, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");
const { validarJWT } = require("../middlewares/validar-jwt");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { isDate } = require("../helpers/isDate");
const router = Router()

//todas tienen que pasar por la validacion del JWT
router.use(validarJWT)

//obtener evento
router.get('/',getEvento);

//crear un evento
router.post('/',
[
  check('title','titulo es obligatorio').not().isEmpty(),
  check('start','fecha de inicio es obligatorio').custom(isDate),
  check('end','fecha de finalizacion es obligatorio').custom(isDate),
  validarCampos
],crearEvento);

//actualizar un evento
router.put('/:id',actualizarEvento);

//eliminar un evento
router.delete('/:id',eliminarEvento);

module.exports = router