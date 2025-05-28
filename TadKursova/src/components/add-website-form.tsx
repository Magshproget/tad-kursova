import React from "react";
import { Button, Input, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";

interface AddWebsiteFormProps {
  onAddWebsite: (url: string, name: string) => void;
}

export function AddWebsiteForm({ onAddWebsite }: AddWebsiteFormProps) {
  const [url, setUrl] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    // Add http:// if missing
    let formattedUrl = url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      formattedUrl = `https://${url}`;
    }
    
    onAddWebsite(formattedUrl, name);
    setUrl("");
    setName("");
    setError(null);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Website URL"
        placeholder="https://example.com"
        value={url}
        onValueChange={setUrl}
        startContent={<Icon icon="lucide:globe" className="text-default-400" />}
        isRequired
        description="Enter the full URL including http:// or https://"
        errorMessage={error}
        isInvalid={!!error}
      />
      
      <Input
        label="Website Name (Optional)"
        placeholder="My Website"
        value={name}
        onValueChange={setName}
        startContent={<Icon icon="lucide:tag" className="text-default-400" />}
        description="A friendly name to identify this website"
      />
      
    
      
      <Button 
        color="primary" 
        type="submit" 
        startContent={<Icon icon="lucide:plus" />}
        className="w-full"
      >
        Add Website
      </Button>
    </form>
  );
}