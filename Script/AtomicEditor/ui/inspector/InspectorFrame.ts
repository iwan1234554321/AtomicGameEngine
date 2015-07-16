
import EditorEvents = require("../../editor/EditorEvents");
import ScriptWidget = require("../ScriptWidget");
import DataBinding = require("./DataBinding");

// inspectors

import MaterialInspector = require("./MaterialInspector");
import ModelInspector = require("./ModelInspector");
import NodeInspector = require("./NodeInspector");

class InspectorFrame extends ScriptWidget {

    constructor() {

        super();

        this.gravity = Atomic.UI_GRAVITY_TOP_BOTTOM;

        this.load("AtomicEditor/editor/ui/inspectorframe.tb.txt");

        var container = this.getWidget("inspectorcontainer");

        this.subscribeToEvent(EditorEvents.EditResource, (data) => this.handleEditResource(data));
        this.subscribeToEvent("EditorActiveNodeChange", (data) => this.handleActiveNodeChange(data));


    }

    handleEditResource(ev: EditorEvents.EditResourceEvent) {

        var path = ev.path;

        var db = ToolCore.getAssetDatabase();
        var asset = db.getAssetByPath(path);

        if (asset) {

            this.inspectAsset(asset);

        }

    }

    handleActiveNodeChange(data) {

        var node = <Atomic.Node> data.node;

        if (!node) {

            return;
        }

        this.inspectNode(node);

    }


    inspectAsset(asset: ToolCore.Asset) {

        if (asset.importerTypeName == "ModelImporter") {

            var container = this.getWidget("inspectorcontainer");
            container.deleteAllChildren();

            var inspector = new ModelInspector();
            container.addChild(inspector);

            inspector.inspect(asset);


        }

        if (asset.importerTypeName == "MaterialImporter") {

            var cache = Atomic.getResourceCache();

            var material = <Atomic.Material> cache.getResource("Material", asset.path);

            if (!material) {
                return;
            }

            var container = this.getWidget("inspectorcontainer");
            container.deleteAllChildren();

            var materialInspector = new MaterialInspector();
            container.addChild(materialInspector);

            materialInspector.inspect(asset, material);

        }

    }

    inspectNode(node: Atomic.Node) {

        if (!node) return;

        var container = this.getWidget("inspectorcontainer");
        container.deleteAllChildren();

        var inspector = new NodeInspector();
        container.addChild(inspector);

        inspector.inspect(node);

    }

}

export = InspectorFrame;
