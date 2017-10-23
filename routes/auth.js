var express = require('express');
var router = express.Router();
var controller = require('../controllers/AuthController.js');

// все апи функции примиают параметры в таком виде - ApiFuncName?Param1=val1&Param2=val2
// необходимый формат параметров:
// DateOfBirth = 2009-05-29
// Type = один из следующих ['Admin','Doctor','Patient']
// Gender = один из следующих ['Male','Female']
// Password = минимум 8 символов


// при успешном выполнении возвращают {Ok:'Текст'} или то что указано в описании функции
// при ошибке {Error:'Текст'}

// вход
// обязательные параметры Email,Password,Id(ид текущего пользователся в кукис,если никто не залогинен передать '')
// в случае успеха вернет {Ok:"You are logged in",Id:'id залогиненого юзера'}
router.get('/login', function (req, res, next) {
    controller.login(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json({Error:err});
        })
});


// регистрация, и вход после успешной регистрации
// обязательные параметры Email,Password,Type,FullName,Id(ид текущего пользователя в кукис,если никто не залогинен передать '')
// не обязательные параметры Gender,City,DateOfBirth
// в случае успеха вернет {Ok:"Your registration complete and you logged in",Id:'id зареганого юзера',User:{данные о юзере}}
router.get('/register', function (req, res, next) {
    controller.register(req).then(function (document) {
            res.json(document);
        },
        function (err) {
        if (err.errmsg.search(/Email_1 dup key/) != -1) {
            res.json({Error:"This email is busy"});
        } else {
            res.json({Error: err});
        }
        })
});


router.get('/check', function (req, res, next) {
            res.json({Ok:"Backend is enabled"});
});


module.exports = router;