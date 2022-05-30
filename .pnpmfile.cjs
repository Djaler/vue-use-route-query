function readPackage(pkg, context) {
    if (pkg.name === 'vue-template-compiler') {
        pkg.peerDependencies = {
            ...pkg.peerDependencies,
            vue: pkg.version
        }
    }

    return pkg
}

module.exports = {
    hooks: {
        readPackage
    }
}
