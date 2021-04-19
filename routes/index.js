const express = require('express');
const router = express.Router();
//Modelos 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//Inicio 
//Modelo Carrera
const CarreraSchema = new Schema({
    NombreCarrera: { type: String, required: true, max: 50, unique: false }
});

const Carrera = mongoose.model('Carrera', CarreraSchema);

//Modelo Asignatura
const AsignaturaSchema = new Schema({
    NombreAsignatura: { type: String, required: true, max: 50, unique: false },
    Cuatrimestre: { type: Number, required: true, max: 50, unique: false },
    NombreCarrera: { type: String, required: true, max: 50, unique: false },
});

const Asignatura = mongoose.model('Asignatura', AsignaturaSchema);

//Modelo Alumno
const AlumnoSchema = new Schema({
    NombrePropio: { type: String, required: true, max: 50, unique: false },
    ApePaterno: { type: String, required: true, max: 50, unique: false },
    ApeMaterno: { type: String, required: true, max: 50, unique: false },
    Domicilio: { type: String, required: true, max: 50, unique: false },
    Telefono: { type: Number, required: true, unique: false },
    CorreoElectrónico: { type: String, required: true, max: 50, unique: true },
    CuatrimestreCusaActual: { type: Number, required: false, min: 1, max: 6 },
    NombreCarrera: { type: String, required: true, max: 50, unique: false },
});

const Alumno = mongoose.model('Alumno', AlumnoSchema);

//Modelo UnidadAsignatura
const UnidadAsignaturaSchema = new Schema({
    NombreAsignatura: { type: String, required: true, max: 50, unique: false },
    NombreUnidad: { type: String, required: true, max: 50, unique: false },
    NumUnidad: { type: Number, required: true, max: 50, unique: false }
});

const UnidadAsignatura = mongoose.model('UnidadAsignatura', UnidadAsignaturaSchema);

//Modelo Calificacion
const CalificaciónSchema = new Schema({
    NombreCompleto: { type: String, required: true, max: 50, unique: false },
    NombreAsignatura: { type: String, required: true, max: 50, unique: false },
    NumUnidad: { type: Number, required: true, max: 50, unique: false },
    CalifOrdinario: { type: Number, required: false, min: 0, max: 10, unique: false },
    CalifRecuperacion1: { type: Number, required: false, min: 0, max: 8, unique: false },
    CalifRecuperacion2: { type: Number, required: false, min: 0, max: 8, unique: false },
    CalifGlobal: { type: Number, required: false, min: 0, max: 8, unique: false },
});

const Calificacion = mongoose.model('Calificación', CalificaciónSchema);
//Fin

/* OBTENER LA PAGINA DEL ALUMNO */
router.get('/', function (req, res, next) {
    Alumno.find({}, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render('./index', {
                list: docs,
                litle: 'Alumnos'
            });
        }
        else {
            console.log('Error trayendo la lista : ' + err);
        }
    }).lean();
});

//Llama a las funciones para AGREGAR ALUMNO
router.post('/', (req, res) => {
    insertRecord(req, res);
});

//FUNCIÓN PARA AGREGAR ALUMNO 
function insertRecord(req, res) {
    const alumno = new Alumno();
    alumno.NombrePropio = req.body.NombrePropio;
    alumno.ApePaterno = req.body.ApePaterno;
    alumno.ApeMaterno = req.body.ApeMaterno;
    alumno.Domicilio = req.body.Domicilio;
    alumno.Telefono = req.body.Telefono;
    alumno.CorreoElectrónico = req.body.CorreoElectrónico;
    alumno.CuatrimestreCusaActual = req.body.CuatrimestreCusaActual;
    alumno.NombreCarrera = req.body.NombreCarrera;
    alumno.save((err, doc) => {
        if (!err)
            res.redirect('./');
        else
            console.log('Error durante la insercion : ' + err);
    });
};

//ACTUALIZACIÓN DE ALUMNOS
router.post('/update', (req, res) => {
    Alumno.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/');
            console.log(req.body);
            console.log('todo correcto');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('./index', {
                    title: 'Alumnos',
                    alumno: req.body
                });
            }
            else
                console.log('Error durante la actualizacion: ' + err);
        }
    });
});

/* PAGINA PARA EL BORRAR ALUMNOS */
router.get('/delete', function (req, res, next) {
    Calificacion.find({ CalifOrdinario: null }, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render('./borrarAlumno', {
                delete: docs,
                title: 'Borrar Alumnos'
            });
        }
        else {
            console.log('Error trayendo la lista : ' + err);
        }
    }).lean();
});

//BORRAR ALUMNOS 
router.get('/delete/:id', (req, res) => {
    Calificacion.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/');
        }
        else { console.log('Error durante la eliminación : ' + err); }
    });
});

//Traer vista de Calificaciones
/* GET home page. */
router.get('/Calificaciones', function (req, res, next) {
    Calificacion.find({}, (err, docs) => {
        if (!err) {
            console.log(docs);
            res.render('./calificaciones', {
                list: docs,
                title: 'Calificaciones'
            });
        }
        else {
            console.log('Error trayendo la lista : ' + err);
        }
    }).lean();
});

//Llama a las funciones para ejecularlas Y poder insertar al Alumno
router.post('/asignatura', (req, res) => {
    insertAsignatura(req, res);
});

//Funcion para agregar Alumno
function insertAsignatura(req, res) {
    const asig = new Asignatura();
    asig.NombreAsignatura = req.body.NombreAsignatura;
    asig.Cuatrimestre = req.body.Cuatrimestre;
    asig.NombreCarrera = req.body.ClaveCarrera;
    asig.save((err, doc) => {
        if (!err) {
            console.log('Todo correcto');
            //res.redirect('./calificaciones');
        } else
            console.log('Error durante la insercion : ' + err);
    });
};

//LLAMA A LA FUNCION AGREGAR CARRERAS
router.post('/carrera', (req, res) => {
    insertCarrera(req, res);
});

//Funcion para agregar CARRERA
function insertCarrera(req, res) {
    const carrera = new Carrera();
    carrera.NombreCarrera = req.body.NombreCarrera;
    carrera.save((err, doc) => {
        if (!err) {
            console.log('Todo correcto');
            res.send(200);
        } else
            console.log('Error durante la insercion : ' + err);
    });
};

//LLAMADA PARA LA FUNCION AGREGAR ASIGNATURA
router.post('/asignatura', (req, res) => {
    insertAsignatura(req, res);
});

//Funcion para agregar ASIGNATURA
function insertAsignatura(req, res) {
    const asignatura = new Asignatura();
    asignatura.NombreAsignatura = req.body.NombreAsignatura;
    asignatura.Cuatrimestre = req.body.Cuatrimestre;
    asignatura.NombreCarrera = req.body.NombreCarrera;
    asignatura.save((err, doc) => {
        if (!err) {
            console.log('Todo correcto');
            res.send(200);
        } else
            console.log('Error durante la insercion : ' + err);
    });
};

//AGREGAR UNIDAD ASIGNATURA
router.post('/Uasignatura', (req, res) => {
    insertUAsignatura(req, res);
});

//Funcion para agregar Alumno
function insertUAsignatura(req, res) {
    const Uasignatura = new UnidadAsignatura();
    Uasignatura.ClaveAsignatura = req.body.ClaveAsignatura;
    Uasignatura.NombreUnidad = req.body.NombreUnidad;
    Uasignatura.NumUnidad = req.body.NumUnidad;
    Uasignatura.save((err, doc) => {
        if (!err) {
            console.log('Todo correcto');
            res.send(200);
        } else
            console.log('Error durante la insercion : ' + err);
    });
};

//AGREGAR UNIDAD ASIGNATURA
router.post('/Calificacion', (req, res) => {
    insertCalif(req, res);
});

//Funcion para agregar Alumno
function insertCalif(req, res) {
    const calif = new Calificacion();
    calif.NombreCompleto = req.body.NombreCompleto;
    calif.NombreAsignatura = req.body.NombreAsignatura;
    calif.NumUnidad = req.body.NumUnidad;
    calif.CalifOrdinario = req.body.CalifOrdinario;
    calif.CalifRecuperacion1 = req.body.CalifRecuperacion1;
    calif.CalifRecuperacion2 = req.body.CalifRecuperacion2;
    calif.CalifGlobal = req.body.CalifGlobal;
    calif.save((err, doc) => {
        if (!err) {
            console.log('Todo correcto');
            res.send(200);
        } else
            console.log('Error durante la insercion : ' + err);
    });
};

//FIND BY ID
router.get('/updateCalif/:id', (req,res) => {
    Calificacion.findById(req.params.id).then((docs) => {
        console.log(docs);
        
        res.render('./updateCalif', {
            list: docs,
            title: 'Calificaciones Actulización' })
    }).catch((error)=>{
     if(error)
         throw error;
    });
  });

//ACTUALIZACIÓN DE CALIFICACION 
router.post('/updateCalif', (req, res) => {
    Calificacion.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) => {
        if (!err) {
            res.redirect('/Calificaciones');
            console.log(req.body);
            console.log('todo correcto');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('./updateCalif', {
                    title: 'Calificacion',
                    alumno: req.body
                });
            }
            else
                console.log('Error durante la actualizacion: ' + err);
        }
    });
});

module.exports = router;
