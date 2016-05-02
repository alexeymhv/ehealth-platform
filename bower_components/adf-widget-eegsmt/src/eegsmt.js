'use strict';

angular.module('adf.widget.eegsmt', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('eegsmt', {
        title: 'EEG-SMT Live',
        description: 'This widget shows your brainwave activity.',
        templateUrl: '{widgetsPath}/eegsmt/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/eegsmt/src/edit.html'
        }
      });
  });
