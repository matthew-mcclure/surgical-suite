var es = require('event-stream')
var gulp = require('gulp')
var concat = require('gulp-concat')
var templateCache = require('gulp-angular-templatecache')
var ngAnnotate = require('gulp-ng-annotate')
var uglify = require('gulp-uglify')
var zip = require('gulp-zip')
var minimist = require('minimist')
var fs = require('fs')
var _ = require('lodash')
var path = require('path')
var mergeStream = require('merge-stream')
var strip = require('gulp-strip-comments')
var babel = require('gulp-babel')

var adminScripts = require('./client/admin/app.scripts.json')
var publicScripts = require('./client/public/app.scripts.json')

var source = {
    admin: {
        js: {
            main: 'client/admin/modules/app/main.js',
            src: [
                // application config
                'client/admin/app.config.js',

                // application bootstrap file
                'client/admin/modules/main.js',

                // main module
                'client/admin/modules/app.js',

                // module files
                'client/admin/modules/**/module.js',

                // other js files [controllers, services, etc.]
                'client/admin/modules/**/!(module)*.js'
            ],
            tpl: 'client/admin/modules/**/*.tpl.html'
        }
    },
    public: {
        js: {
            src: [
                // application bootstrap file
                'client/public/modules/main.js',

                // main module
                'client/public/modules/app.js',

                // module files
                'client/public/modules/**/module.js',

                // other js files [controllers, services, etc.]
                'client/public/modules/**/!(module)*.js'
            ],
            tpl: 'client/public/modules/**/*.tpl.html'
        }
    }
}

var destinations = {
    admin: {
        js: 'client/admin/build'
    },
    public: {
        js: 'client/public/build'
    }
}

gulp.task('admin-js', function() {
    return es.merge(gulp.src(source.admin.js.src), getTemplateStream())
        // .pipe(uglify())
        .pipe(concat('app.js'))
        .on('error', swallowError)
        .pipe(gulp.dest(destinations.admin.js))
})

gulp.task('public-js', function() {
    return es.merge(gulp.src(source.public.js.src))
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(ngAnnotate())
        // .pipe(uglify())
        .pipe(concat('app.js'))
        .on('error', swallowError)
        .pipe(gulp.dest(destinations.public.js))
})

gulp.task('watch', function() {
    gulp.watch(source.admin.js.src, ['admin-js'])
    gulp.watch(source.admin.js.tpl, ['admin-js'])
    gulp.watch(source.public.js.src, ['public-js'])
    gulp.watch(source.public.js.tpl, ['public-js'])
})

gulp.task('vendor-admin', buildAdminVendor)

gulp.task('vendor-public', buildPublicVendor)

function buildPublicVendor(scripts, dest) {
    return buildVendor(publicScripts, destinations.public.js)
}

function buildAdminVendor(scripts, dest) {
    return buildVendor(adminScripts, destinations.admin.js)
}

function buildVendor(scripts, dest) {
    let tasks = []
    _.forIn(scripts.chunks, function(chunkScripts, chunkName) {
        var paths = []
        chunkScripts.forEach(function(script) {
            var scriptFileName = scripts.paths[script]
            var scriptPath = path.join(__dirname, scriptFileName)
            if (!fs.existsSync(scriptPath)) {
                throw console.error(`Required path doesn't exist: ${scriptPath}`, script)
            }
            paths.push(scriptFileName)
        })

        tasks.push(gulp.src(paths)
            .pipe(concat(chunkName + '.js'))
            .on('error', swallowError)
            .pipe(strip())
            // .pipe(uglify())
            .pipe(gulp.dest(dest)))
    })
    return mergeStream(tasks)
}

gulp.task('default', ['dev'])
gulp.task('dev', ['vendor-admin', 'vendor-public', 'admin-js', 'admin-js', 'public-js', 'watch'])
gulp.task('admin', ['vendor-admin', 'admin-js', 'watch'])
gulp.task('public', ['vendor-public', 'public-js', 'watch'])

var knownOptions = {
    string: 'packageName',
    string: 'packagePath',
    default: {
        packageName: 'Package.zip',
        packagePath: path.join(__dirname, '_package')
    }
}

var options = minimist(process.argv.slice(2), knownOptions)
gulp.task('prod', ['prod-vendor', 'admin-js', 'public-js'], buildProdPackage)
gulp.task('prod-vendor', function() {
    buildVendor(publicScripts, destinations.public.js)
    buildVendor(adminScripts, destinations.admin.js)
})

function buildProdPackage() {
    var packagePaths = ['**',
        '!**/_package/**',
        '!**/typings/**',
        '!typings',
        '!_package',
        '!gulpfile.js',
        '!**/client/libs/**'
    ]

    // add exclusion patterns for all dev dependencies
    var packageJSON = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'))
    var devDeps = packageJSON.devDependencies

    for (var propName in devDeps) {
        var excludePattern1 = '!**/node_modules/' + propName + '/**'
        var excludePattern2 = '!**/node_modules/' + propName
        packagePaths.push(excludePattern1)
        packagePaths.push(excludePattern2)
    }

    return gulp.src(packagePaths)
        .pipe(zip(options.packageName))
        .pipe(gulp.dest(options.packagePath))
}

var swallowError = function(error) {
    console.log(error.toString())
    this.emit('end')
}

var getTemplateStream = function() {
    return gulp.src(source.admin.js.tpl)
        .pipe(templateCache({
            root: 'app/',
            module: 'app'
        }))
}

var getPublicTemplateStream = function() {
    return gulp.src(source.public.js.tpl)
        .pipe(templateCache({
            root: 'client/',
            module: 'public'
        }))
}
