module.exports = function (grunt) {
    grunt.initConfig({
        uglify: {
            game: {
                files: {
                    'dist/game.min.js': ['src/game.js']
                }
            }
        },
        copy: {
            game: {
                files: [{
                    src: ['src/game.css'],
                    dest: 'dist/game.css'
                }, {
                    src: ['src/index.html'],
                    dest: 'dist/index.html'
                }],
            },
        }
    });

    grunt.registerTask('default', ['uglify', 'copy']);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
};