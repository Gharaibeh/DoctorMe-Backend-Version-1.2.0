var express = require('express');
var router = express.Router();
var controller = require('../controllers/UserController.js');

// все апи функции примиают параметры в таком виде - ApiFuncName?Param1=val1&Param2=val2
// необходимый формат параметров:
// DateOfBirth = 2009-05-29
// Type = один из следующих ['Admin','Doctor','Patient']
// Gender = один из следующих ['Male','Female']
// Password = минимум 8 символов

// при успешном выполнении возвращают {Ok:'Текст'} или то что указано в описании функции
// при ошибке {Error:'Текст'}


// добавление юзера
// для того чтобы добавить доктора,нужно залогинится как админ
// для того чтобы добавить пациента,нужно залогинится как доктор
// обязательные параметры Email(email добавляемого юзера),Password(тип изменяемого юзера) и FullName
// Id(ид текущего пользователся в кукис,если никто не залогинен передать '')
// не обязательные параметры Gender,City,DateOfBirth
// Type добавлять не надо,он будет выбран автоматически в зависимости от того кто залогинен
router.get('/add', function (req, res, next) {

    controller.add(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.errmsg.search(/Email_1 dup key/) != -1) {
                res.json({Error:"This email is busy"});
            }
            else if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json({Error: err});
            }
        })
});

// редактирование юзера
// для того чтобы изменить доктора,нужно залогинится как админ
// для того чтобы изменить пациента,нужно залогинится как доктор
// обязательные параметры Email(email изменяемого юзера),Type(тип изменяемого юзера)
// Id(ид текущего пользователся в кукис,если никто не залогинен передать '')
// не обязательные параметры FullName,Gender,City,DateOfBirth - поля которые будут изменены
router.get('/edit', function (req, res, next) {
    controller.edit(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.errmsg.search(/Email_1 dup key/) != -1) {
                res.json({Error:"This email is busy"});
            }
            else if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json({Error: err});
            }
        })

});


// изменение пароля
// доступно только админу
// Id(ид текущего пользователся в кукис,если никто не залогинен передать '')
// обязательные параметры Email(email юзера пароль которого изменится),Password (новый пароль)
router.get('/resetPassword', function (req, res, next) {
    controller.resetPassword(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })

});

// выполняет поиск в зависимости от того,кто залогинен,если Doctor - вернет пациентов(со списком их лечащих врачей),
// если Admin - докторов
// Id(ид текущего пользователся в кукис,если никто не залогинен передать '')
// не обязательные параметры FullName,LastName,Email,Gender,City,DateOfBirth
router.get('/search', function (req, res, next) {
    controller.search(req).then(function (document) {
            res.json(document);
        },
        function (err) {
        if (err.message.search(/Cast to ObjectId failed/) != -1)
        {
            res.json({Error:"User with this id not found"})
        }
        else {
            res.json(err);
        }
        })
});


// удаление юзера
// для того чтобы удалить доктора,нужно залогинится как админ
// для того чтобы удалить пациента,нужно залогинится как доктор
// обязательные параметры Email(email удаляемого юзера),Type(тип удаляемого юзера)
// Id(ид текущего пользователся в кукис,если никто не залогинен передать '')
router.get('/delete', function (req, res, next) {
    controller.delete(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })
});




// возвращает список всех пациентов с их докторами
// без параметров
router.get('/patients', function (req, res, next) {
    controller.allPatients(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })
});

router.get('/', function (req, res, next) {//временная функция для отладки,выводит всех юзеров из бд
    controller.find(req).then(function (document) {

            res.send(document);
        },
        function (err) {
            res.json(err);
        })
});

// обязательные параметры Id
// возвращет данные о юзере в таком формате
/*
{
    _id: "59d3679542a7d70340036fe2",
    Password: "f256d755ea4bf9c502e5e1d1191599f812c1980e",
    FullName: "DcMark",
    Email: "123@mail.ru",
    Type: "Doctor",
    salt: "0.8515276845630868",
    __v: 0,
    appointmentIdCounter: 0,
    Appointments: [ ]
}
*/
router.get('/findById', function (req, res, next) {
    controller.findById(req).then(function (document) {
            res.send(document);
        },
        function (err) {
            if (err.message.search(/Cast to ObjectId failed/) != -1)
            {
                res.json({Error:"User with this id not found"})
            }
            else {
                res.json(err);
            }
        })
});

// назначает доктора пациенту
// обязательные параметры
// DoctorId,PatientId
router.get('/bindDoctor', function (req, res, next) {
    controller.bindDoctor(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});

module.exports = router;
