
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateProjectDialog } from "./CreateProjectDialog";

export interface Project {
  id: string;
  name: string;
  type?: string;
  description?: string;
}

export function ProjectList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Initialize projects from localStorage or use default projects
  const initialProjects = JSON.parse(localStorage.getItem("projects") || "null") || [
    { id: "a", name: "Projeto A" },
    { id: "b", name: "Projeto B" },
    { id: "c", name: "Projeto C" },
  ];

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const handleAddProject = (projectData: { name: string; type: string; description: string }) => {
    // Get the next letter in the alphabet after the last project
    const lastProjectId = projects[projects.length - 1].id;
    let nextId: string;

    // If the last ID is a letter, get the next letter
    if (lastProjectId.length === 1 && lastProjectId >= "a" && lastProjectId <= "z") {
      const nextChar = String.fromCharCode(lastProjectId.charCodeAt(0) + 1);
      nextId = nextChar;
    } else {
      // Fallback to a unique ID if it's not a simple letter
      nextId = String.fromCharCode("a".charCodeAt(0) + projects.length);
    }

    const newProject: Project = {
      id: nextId,
      name: projectData.name || `Projeto ${nextId.toUpperCase()}`,
      type: projectData.type,
      description: projectData.description,
    };

    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);

    // Save to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    setIsDialogOpen(false);
    
    toast({
      title: "Novo projeto criado",
      description: `O projeto "${newProject.name}" foi criado com sucesso.`,
    });
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    // Filter out the project to remove
    const updatedProjects = projects.filter((project) => project.id !== projectId);

    // Update state
    setProjects(updatedProjects);

    // Save to localStorage
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    toast({
      title: "Projeto removido",
      description: `O projeto "${projectName}" foi removido com sucesso.`,
    });
  };

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-gray-300">Projetos</h3>
      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-800 p-3 rounded-md flex justify-between items-center hover:bg-gray-700 transition-colors"
          >
            <div
              className="flex-1 cursor-pointer text-center"
              onClick={() => handleProjectClick(project.id)}
            >
              {project.name}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-600">
                  <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover projeto</AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-300">
                    Tem certeza que deseja remover o projeto "{project.name}"? Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => handleDeleteProject(project.id, project.name)}
                  >
                    Remover
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-1 mt-2 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" /> Novo projeto
        </Button>
        
        <CreateProjectDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          onCreateProject={handleAddProject} 
        />
      </div>
    </div>
  );
}
