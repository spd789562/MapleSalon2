use std::fs;
use std::path::Path;

const I18N_FOLDER: &'static str = "./src/assets/i18n";

fn create_empty_category_file(lang: &str, category: &str) -> Result<(), std::io::Error> {
    let path = format!("{}/{}/{}.ts", I18N_FOLDER, lang, category);
    let content = "export const dist = {\n};\n";
    fs::write(path, content)
}

// use rustc to generate add_command.exe
// and then add_command.exe {category}.{text} {category}.{text} ...
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let locales: Vec<String> = std::env::args().skip(1).collect();

    if locales.len() < 1 {
        eprintln!("Usage: add_command <need_add_locale> <need_add_locale> ...");
        std::process::exit(1);
    }

    let entries = fs::read_dir(I18N_FOLDER);

    if entries.is_err() {
        eprintln!("Error: {}", entries.err().unwrap());
        std::process::exit(1);
    }

    let entries = entries.unwrap();
    let mut langs = vec![];
    for entry in entries {
        let entry = entry?;
        if entry.path().is_dir() {
            langs.push(entry.file_name().to_str().unwrap().to_string());
        }
    }

    for locale in locales {
        let mut split = locale.split('.');
        let category = split.next().unwrap();
        let text = split.next();
        if text.is_none() {
            eprintln!("Error: Invalid locale format must be <category>.<text>");
            continue;
        }
        let text = text.unwrap();
        'lang: for lang in langs.iter() {
            let file_path = format!("{}/{}/{}.ts", I18N_FOLDER, lang, category);
            if !Path::new(&file_path).exists() {
                create_empty_category_file(lang.as_str(), &category)?;
            }
            let file = fs::read_to_string(&file_path)?;
            let mut new_file = String::new();
            // duplicate check
            for line in file.lines() {
                if line.contains(text) {
                    eprintln!("Error: {} already exists in {}", text, locale);
                    continue 'lang;
                }
                if line == "};" {
                    new_file.push_str(&format!("  {}: \"\",\n", text));
                }
                new_file.push_str(line);
                new_file.push_str("\n");
            }
            fs::write(&file_path, new_file)?;
        }
    }

    Ok(())
}
