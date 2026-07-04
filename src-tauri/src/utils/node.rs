pub fn split_path_after_img(path: &str) -> Option<&str> {
    let mut pathes = path.split_inclusive(".img");
    let _img_path = pathes.next()?;

    pathes.next()?.strip_prefix('/')
}
