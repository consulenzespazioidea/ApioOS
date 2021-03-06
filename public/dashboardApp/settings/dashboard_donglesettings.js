angular.module('ApioDashboardApplication').controller('ApioDashboardDongleSettingsController', ['$rootScope', '$scope', 'sweet', 'userService', 'objectService', '$http', 'socket', function ($rootScope, $scope, sweet, userService, objectService, $http, socket) {
    socket.on("dongle_update", function (data) {
        $rootScope.$emit('terminal.dongle.echo', data)
    });

    $http.get("/apio/user/getSessionComplete").success(function (session) {
        $scope.session = session;
    });
    

    socket.on("dongle_onoff_update", function (data) {
        if ($scope.session.apioId === data.apioId) {
            $scope.active = data.value;
        }
        //$scope.active = data;
    });

    socket.on("dongle_settings_changed", function (data) {
        if ($scope.session.apioId === data.apioId) {
            $scope.currentFirmwareVersion = data.value.firmwareVersion;
            $scope.currentPanId = data.value.panId;
            $scope.currentDataRate = data.value.dataRate;
        }
        //$scope.currentFirmwareVersion = data.firmwareVersion;
        //$scope.currentPanId = data.panId;
        //$scope.currentDataRate = data.dataRate;
    });
    
    socket.on("dongle_settings", function (data) {
    	
        /*if ($scope.session.apioId === data.apioId) {
            $scope.currentFirmwareVersion = data.value.firmwareVersion;
            $scope.currentPanId = data.value.panId;
            $scope.currentDataRate = data.value.dataRate;
        }*/
        //$scope.currentFirmwareVersion = data.firmwareVersion;
        //$scope.currentPanId = data.panId;
        //$scope.currentDataRate = data.dataRate;
        $scope.currentPanId = data.panId;
    });

    $scope.selected = 1;
    $scope.active = true;
    $scope.currentDataRate = "3";
    $scope.launchSection = function (value) {
        $scope.selected = value;
    };

    $scope.DataRateValue = [
        {
            id: 0,
            name: "250kb/s"
        },
        {
            id: 1,
            name: "500kb/s"
        },
        {
            id: 2,
            name: "1000kb/s"
        },
        {
            id: 3,
            name: "2000kb/s"
        }
    ];

    $scope.powers = [
        {id: 0, name: "3.5 dBm"},
        {id: 1, name: "3.3 dBm"},
        {id: 2, name: "2.8 dBm"},
        {id: 3, name: "2.3 dBm"},
        {id: 4, name: "1.8 dBm"},
        {id: 5, name: "1.2 dBm"},
        {id: 6, name: "0.5 dBm"},
        {id: 7, name: "-0.5 dBm"},
        {id: 8, name: "-1.5 dBm"},
        {id: 9, name: "-2.5 dBm"},
        {id: 10, name: "-3.5 dBm"},
        {id: 11, name: "-4.5 dBm"},
        {id: 12, name: "-6.5 dBm"},
        {id: 13, name: "-8.5 dBm"},
        {id: 14, name: "-11.5 dBm"},
        {id: 15, name: "-16.5 dBm"}
    ];

    $scope.dongleSettings = function () {
        $http.get("/apio/service/dongle/route/" + encodeURIComponent("/apio/dongle/getSettings")).success(function (data) {
            //$scope.currentFirmwareVersion = data.firmwareVersion;
            $scope.currentPanId = data.panId;
            //$scope.currentDataRate = data.dataRate;
            //$scope.currentRadioPower = data.radioPower;
        });
    };

    $scope.changeDongleSettings = function () {
        $http.post("/apio/service/dongle/route/" + encodeURIComponent("/apio/dongle/changeSettings") + "/data/" + encodeURIComponent(JSON.stringify({
                firmwareVersion: $scope.currentFirmwareVersion,
                panId: $scope.newPanId,
                dataRate: $scope.currentDataRate
                //radioPower: $scope.currentRadioPower
            }))).success(function (data) {
        }).error(function (data) {
        });
    };

    $scope.dongleSettings();

    $scope.activateDongle = function (flag) {
        if (flag == true) {
            $scope.active = true;
            $http.post("/apio/service/dongle/route/" + encodeURIComponent("/apio/dongle/onoff") + "/data/" + encodeURIComponent(JSON.stringify({
                    onoff: true
                }))).success(function (data) {
                if (data.error) {
                } else {
                }
            }).error(function (data) {
            });
        } else {
            $scope.active = false;
            $http.post("/apio/service/dongle/route/" + encodeURIComponent("/apio/dongle/onoff") + "/data/" + encodeURIComponent(JSON.stringify({
                    onoff: false
                }))).success(function (data) {
                if (data.error) {
                } else {
                }
            }).error(function (data) {
            });
        }
    };

    $scope.updateDongleFirmware = function () {
        $http.post("/apio/service/dongle/route/" + encodeURIComponent("/apio/dongle/onoff") + "/data/" + encodeURIComponent(JSON.stringify({
                onoff: false
            }))).success(function (data) {
            if (data.error) {
            } else {
                $http.get("/apio/service/dongle/route/" + encodeURIComponent("/apio/dongle/updateDongle")).success(function (data) {
                    alert("Aggiornato!");
                    $scope.active = true;
                });
            }
        }).error(function (data) {
        });
    };

    $scope.currentUserEmail = function () {
        $http.get('/apio/user/getSession').success(function (data) {
            console.log(data);
            $http.post('/apio/user/getUser', {
                email: data
            }).success(function (a) {
                console.log(a);
                $scope.currentUserActive = a.user;
                console.log($scope.currentUserActive);
            });
            //$scope.currentUserActive = data;
        });
    };

    $scope.currentUserEmail();

    $scope.confirmChange = function () {
        console.log($scope.userEmail + " " + $scope.userPassword);
        //$('#addUser').modal('hide');
        $http.post('/apio/user/changePassword', {
            email: $scope.currentUserActive.email,
            password: $scope.exPassword,
            newPassword: $scope.newPassword
        }).success(function (data) {
            if (data.error) {
                console.log("data.error");
                $scope.$signupError = true;
                sweet.show({
                    title: "Error!",
                    text: "The current password is wrong",
                    type: "error",
                    showCancelButton: false,
                    confirmButtonClass: "btn-error",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                }, function () {
                    //$('#addUser').modal('hide');
                    //$scope.switchPage('Objects');
                    //$state.go('objects.objectsLaunch');
                    //location.reload();
                });
            } else {
                sweet.show({
                    title: "Done!",
                    text: "Password correctly changed",
                    type: "success",
                    showCancelButton: false,
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Ok",
                    closeOnConfirm: true
                }, function () {
                    //$('#addUser').modal('hide');
                    //$scope.switchPage('Objects');
                    //$state.go('objects.objectsLaunch');
                    location.reload();
                });
            }
        }).error(function (data) {
            $scope.$signupError = true;
            sweet.show({
                title: "Error!",
                text: "The password cannot be changed at this moment",
                type: "error",
                showCancelButton: false,
                confirmButtonClass: "btn-error",
                confirmButtonText: "Ok",
                closeOnConfirm: true
            }, function () {
                //$('#addUser').modal('hide');
                location.reload();
            });
        });
    };
}]);