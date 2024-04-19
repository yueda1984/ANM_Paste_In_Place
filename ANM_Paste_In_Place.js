/*
	Paste in Place v1.0
	
	In Harmony, copying a shape and pasting in the same art layer will automatically shift the shape
	in order to prevent it from overlapping on top of the orinal shape. This is however not ideal in some situations.
	This script force to paste a copied shape in the exact place in Camera or Drawing view.
	The script temporarily pastes the shape to an art layer that is not currently selected.
	After the shape is being cut from the layer, the shape gets pasted on to the user selected art layer.
	
	Installation:
	
	1) Download and Unarchive the zip file.
	2) Locate to your user scripts folder (a hidden folder):
	   https://docs.toonboom.com/help/harmony-17/premium/scripting/import-script.html	
	   
	3) Add all unzipped files (*.js, and script-icons folder) directly to the folder above.
	4) Add ANM_Paste_In_Place to your Camera or Drawing view's toolbar.
	   The current version does not work if called on any other toolbars.
	
	
	Direction:

	1) Select a shape in Camera or Drawing view and then either do cut or copy.	
	2) Run ANM_Paste_In_Place.


	Author:

		Yu Ueda (raindropmoment.com)
*/




function ANM_Paste_In_Place()
{
	var sNode = selection.selectedNodes(0);
	var f = frame.current();
	
	// save the original selection tool state
	var applyAllLayersCB = Action.validate("onActionToggleApplyToolToAllLayers()");	
	var applyAllVisibleDrawingsCB = Action.validate("onActionToggleApplyToAllDrawings()");
	var permanentSelectionCB = Action.validate("onActionTogglePermanentSelection()");		
	var overlayIcon = Action.validate("onActionOverlayArtSelected()", "artLayerResponder");
	var lineIcon = Action.validate("onActionLineArtSelected()", "artLayerResponder");
	var colorIcon = Action.validate("onActionColorArtSelected()", "artLayerResponder");
	var underlayIcon = Action.validate("onActionUnderlayArtSelected()", "artLayerResponder");
	var OGArtLayer = 4;
	if		(overlayIcon.checked)	{	var OGArtLayer = 8;}
	if		(colorIcon.checked)	{	var OGArtLayer = 2;}		
	else if	(underlayIcon.checked){	var OGArtLayer = 1;}

	// Set the necessary select tool option
	Action.perform("onActionChooseSelectTool()", "drawingView,cameraView");	
	ToolProperties.setApplyAllArts(false);
	ToolProperties.setApplyAllVisibleDrawings(false);		
	ToolProperties.setPermanentSelectionMode(false);			
	DrawingTools.setCurrentDrawingFromNodeName(sNode, f);	


	scene.beginUndoRedoAccum("Paste in Place");	

	
	// Temporarily switch to an art layer which is different from the current, paste the user copied object
	switch (OGArtLayer)
	{
		case 4: 	DrawingTools.setCurrentArt(8);	break;
		default: 	DrawingTools.setCurrentArt(4);	break;
	}					
	Action.perform("paste()", "drawingView,cameraView");

	// cut the same object then paste on the original art layer
	var validateAction = Action.validate("cut()", "drawingView,cameraView");		
	if (validateAction.enabled)
	{
		Action.perform("cut()", "drawingView,cameraView");
		
		DrawingTools.setCurrentArt(OGArtLayer);
		Action.perform("paste()", "drawingView,cameraView");				
	}

	
	scene.endUndoRedoAccum();		

		
	// set selection tool state back to original states
	ToolProperties.setApplyAllArts(applyAllLayersCB.checked);
	ToolProperties.setApplyAllVisibleDrawings(applyAllVisibleDrawingsCB.checked);		
	ToolProperties.setPermanentSelectionMode(permanentSelectionCB.checked);							
}