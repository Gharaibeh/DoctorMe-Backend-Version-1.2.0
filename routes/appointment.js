var express = require('express');
var router = express.Router();
var controller = require('../controllers/AppointmentController.js');

// все апи функции примиают параметры в таком виде - ApiFuncName?Param1=val1&Param2=val2
// необходимый формат параметров:
// DateOfBirth = 2009-05-29
// Type = один из следующих ['Admin','Doctor','Patient']
// Gender = один из следующих ['Male','Female']
// Password = минимум 8 символов

// при успешном выполнении возвращают {Ok:'Текст'} или то что указано в описании функции
// при ошибке {Error:'Текст'}

// пациент может получить список своих встреч из этого роута - /getCurrentUser из auth.js


// добавить встречу с доктором
// нужно быть залогиненым как доктор
// обязательные параметры: Email(email пациента которому назначают встречу)
// CurrentUserId(ид текущего пользователся в кукис,если никто не залогинен передать '')
// Date - время встречи(формат 2009-05-15T18:45, t- латинская),на это время не должно быть назначено других встреч
// Medication - лекарства
// Log - лог
router.get('/add', function (req, res, next) {
    controller.add(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});


// изменить встречу с доктором
// нужно быть залогиненым как доктор
// обязательные параметры: Email(email пациента)(не меняется,используется для поиска)
// CurrentUserId(ид текущего пользователся в кукис,если никто не залогинен передать '')
// Id - ид встречи(не меняется,используется для поиска)
// Date - время встречи(формат 2009-05-15T18:45, t- латинская),на это время не должно быть назначено других встреч
// Medication - лекарства
// Log - лог
router.get('/edit', function (req, res, next) {
    controller.edit(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});


// удалить встречу с доктором
// нужно быть залогиненым как доктор
// обязательные параметры: Email(email пациента)
// CurrentUserId(ид текущего пользователся в кукис,если никто не залогинен передать '')
// Id - ид встречи
router.get('/delete', function (req, res, next) {
    controller.delete(req).then(function (document) {
            res.json(document);
        },
        function (err) {
            res.json(err);
        })
});

module.exports = router;

