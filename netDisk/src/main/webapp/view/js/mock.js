function getMockData(type) {
    switch (type) {
        case 'allFile':
            return getAllFileData();
        case 'textFile':
            return getTextFileData();
        case 'imageFile':
            return getImgFileData();
        case 'recycleFile':
            return getRecycleFileData();
    }

    function getAllFileData() {
        var device_data = {
            resultList: [{
                    name: 'row 1, cell 1123133333333333333333333333333333333',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                }, {
                    name: 'row 1, cell 1123133333333333333333333333333333333',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                }, {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                }, {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },

                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },

                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },
                {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                }, {
                    name: '1232131',
                    size: '100KB',
                    modifiedTime: '2018-03-14',
                },

            ]
        };
        return device_data;
    }

    function getImgFileData() {
        var device_data = {
            resultList: [{
                name: 'img',
                size: '100M',
                modifiedTime: '2018-03-14',
            }]
        };
        return device_data;
    }

    function getTextFileData() {
        var device_data = {
            resultList: [{
                name: 'text1',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: 'text2',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }]
        };
        return device_data;
    }

    function getRecycleFileData() {
        var device_data = {
            resultList: [{
                name: 'recy1',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: 'recy1 row 1, cell 1123133333333333333333333333333333333',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: '1232131',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: '1232131',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: 'recy1 row 1, cell 1123133333333333333333333333333333333',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: 'recy1 row 1, cell 1123133333333333333333333333333333333',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: '1232131',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }, {
                name: '1232131',
                size: '100KB',
                modifiedTime: '2018-03-14',
            }]
        };
        return device_data;
    }
}

function getRealMockData(type) {
    switch (type) {
        case 'allFile':
            return getRealAllFileData();
        case 'textFile':
            return getRealTextFileData();
        case 'imageFile':
            return getRealImgFileData();
        case 'recycleFile':
            return getRealRecycleFileData();
    }

    function getRealAllFileData() {

    }

    function getRealTextFileData() {

    }

    function getRealImgFileData() {

    }

    function getRealRecycleFileData() {

    }
}


function getMockDirData() {
    return dirMockDataObj;
}

var dirMockDataObj = {
        'childDirNode': [
            {
            'childDirNode': [{
                'childDirNode': [{
                    'childDirNode': [],
                    'level': 3,
                    'modifiedTime': '2018-03-19 11:23:49',
                    'name': '新建文件夹',
                    'size': '0'
                }],
                'level': 2,
                'modifiedTime': '2018-03-19 11:23:49',
                'name': '新建文件夹',
                'size': '0'
            }],
            'level': 1,
            'modifiedTime': '2018-03-19 11:23:46',
            'name': '新建文件夹',
            'size': '0'
        },
         {
            'childDirNode': [{
                'childDirNode': [{
                    'childDirNode': [],
                    'level': 3,
                    'modifiedTime': '2018-03-19 14:27:14',
                    'name': '新建文件夹',
                    'size': '0'
                }],
                'level': 2,
                'modifiedTime': '2018-03-19 14:27:14',
                'name': '新建文件夹',
                'size': '0'
            }, {
                'childDirNode': [],
                'level': 2,
                'modifiedTime': '2018-03-19 14:27:08',
                'name': '新建文件夹 (2)',
                'size': '0'
            }, {
                'childDirNode': [],
                'level': 2,
                'modifiedTime': '2018-03-19 14:27:11',
                'name': '新建文件夹 (3)',
                'size': '0'
            }],
            'level': 1,
            'modifiedTime': '2018-03-19 14:27:11',
            'name': '新建文件夹 (2)',
            'size': '0'
        },
         {
            'childDirNode': [{
                'childDirNode': [],
                'level': 2,
                'modifiedTime': '2018-03-19 14:27:22',
                'name': '新建文件夹',
                'size': '0'
            }],
            'level': 1,
            'modifiedTime': '2018-03-19 14:27:22',
            'name': '新建文件夹 (3)',
            'size': '0'
        }, 
        {
            'childDirNode': [],
            'level': 1,
            'modifiedTime': '2018-03-19 14:26:26',
            'name': '新建文件夹 (4)',
            'size': '0'
        },
         {
            'childDirNode': [],
            'level': 1,
            'modifiedTime': '2018-03-19 14:26:28',
            'name': '新建文件夹 (5)',
            'size': '0'
        }, 
        {
            'childDirNode': [],
            'level': 1,
            'modifiedTime': '2018-03-19 14:26:29',
            'name': '新建文件夹 (6)',
            'size': '0'
        }, 
        {
            'childDirNode': [],
            'level': 1,
            'modifiedTime': '2018-03-19 14:26:31',
            'name': '新建文件夹 (7)',
            'size': '0'
        }, 
        {
            'childDirNode': [],
            'level': 1,
            'modifiedTime': '2018-03-19 14:26:33',
            'name': '新建文件夹 (8)',
            'size': '0'
        }, 
        {
            'childDirNode': [{
                'childDirNode': [],
                'level': 2,
                'modifiedTime': '2018-03-19 14:27:26',
                'name': '新建文件夹',
                'size': '0'
            }],
            'level': 1,
            'modifiedTime': '2018-03-19 14:27:26',
            'name': '新建文件夹 (9)',
            'size': '0'
        }
    ],
        'level': 0,
        'modifiedTime': '2018-03-19 14:26:35',
        'name': 'test',
        'size': '0'
    }
