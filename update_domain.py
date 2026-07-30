import os

directory = r"c:\Users\arenc\Desktop\asiste"

def replace_domain():
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".html") or file.endswith(".css") or file.endswith(".js") or file.endswith(".xml") or file.endswith(".txt"):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if "asistecontraincendios.com" in content:
                    new_content = content.replace("asistecontraincendios.com", "asistecontraincendioslp.es")
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {file}")

if __name__ == "__main__":
    replace_domain()
