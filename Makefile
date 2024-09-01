# Extract the version from package.json
VERSION=$(shell node -p "require('./package.json').version")

# Define the zip target file name
ZIPFILE=change-ttl-v$(VERSION).zip

# Files to include in the zip
FILES=dist/index.js package.json plugin.json main.py README.md LICENSE

# Define the target
.PHONY: zip

zip: $(ZIPFILE)

$(ZIPFILE): $(FILES)
	@echo "Creating zip archive: $(ZIPFILE)"
	@mkdir -p temp/change-ttl
	@cp --parents $(FILES) temp/change-ttl/
	@cd temp && zip -r ../$(ZIPFILE) change-ttl
	@rm -rf temp

clean:
	@echo "Cleaning up..."
	@rm -f $(ZIPFILE)
