'use strict';

exports.register = function(plugin, options, next) {

    const Controllers = {
        user_profiles: {
            user_profile: require('../controllers/user_profile/profiles'),
            user_setting: require('../controllers/user_setting/setting')
        }
    };

    plugin.route([

        // Profile Routes
        {
            method: 'GET',
            path: '/profiles',
            config: Controllers.user_profiles.user_profile.showProfiles
        },

        {
            method: 'POST',
            path: '/profile/{email}',
            config: Controllers.user_profiles.user_profile.editProfiles
        },

        {
            method: 'GET',
            path: '/setting',
            config: Controllers.user_profiles.user_setting.showSetting
        },

        {
            method: 'POST',
            path: '/password',
            config: Controllers.user_profiles.user_setting.changePassword
        },
        {
            method: 'POST',
            path: '/deleteprofile',
            config: Controllers.user_profiles.user_profile.deleteProfile
        }
    ]);

    next();
};

exports.register.attributes = {
    name: 'profiles_routes',
    version: require('../../package.json').version
};
